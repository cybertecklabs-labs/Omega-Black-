const pgvector = require('pgvector/pg');

/**
 * Intelligence Graph - The Brain of OMEGA BLACK
 * Manages semantic memory, asset relationships, and vulnerability predictions.
 */
class IntelligenceGraph {
    constructor({ pool, logger }) {
        this.pool = pool;
        this.logger = logger || console;
        this.VECTOR_DIM = 384; // Standard dimension for local embeddings (e.g., all-MiniLM-L6-v2)
    }

    /**
     * Initialize the graph storage and extensions
     */
    async init() {
        const client = await this.pool.connect();
        try {
            this.logger.info("[GRAPH] Initializing Intelligence Graph...");
            await client.query('CREATE EXTENSION IF NOT EXISTS vector');

            // Ensure schema exists
            await client.query(`
                CREATE TABLE IF NOT EXISTS assets (
                    id TEXT PRIMARY KEY,
                    metadata JSONB,
                    embedding vector(${this.VECTOR_DIM}),
                    last_seen TIMESTAMPTZ DEFAULT NOW(),
                    risk_score FLOAT DEFAULT 0.0
                );
            `);

            this.logger.info("[GRAPH] Schema verified. pgvector ready.");
            return true;
        } catch (error) {
            this.logger.error(`[GRAPH] Initialization failed: ${error.message}`);
            throw error;
        } finally {
            client.release();
        }
    }

    async healthCheck() {
        try {
            await this.pool.query('SELECT 1');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Store intelligence about an asset
     */
    async storeAsset(assetId, metadata, embedding) {
        if (!embedding || embedding.length !== this.VECTOR_DIM) {
            throw new Error(`Invalid embedding dimension. Expected ${this.VECTOR_DIM}, got ${embedding?.length}`);
        }

        const query = `
            INSERT INTO assets (id, metadata, embedding, last_seen)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (id) DO UPDATE 
            SET metadata = $2, embedding = $3, last_seen = NOW()
            RETURNING id, last_seen;
        `;

        const vectorStr = JSON.stringify(embedding);
        const { rows } = await this.pool.query(query, [assetId, metadata, vectorStr]);
        return rows[0];
    }

    /**
     * Find semantically similar assets (Pattern Recognition)
     */
    async findSimilarAssets(embedding, limit = 5) {
        if (!embedding) return [];

        const vectorStr = JSON.stringify(embedding);
        const query = `
            SELECT id, metadata, last_seen, 
            1 - (embedding <=> $1) as similarity
            FROM assets
            WHERE (embedding <=> $1) < 0.4
            ORDER BY embedding <=> $1
            LIMIT $2;
        `;

        try {
            const { rows } = await this.pool.query(query, [vectorStr, limit]);
            return rows;
        } catch (error) {
            this.logger.error(`[GRAPH] Similarity search failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Predict vulnerability likelihood based on graph patterns
     * Returns a normalized prediction object.
     */
    async predictWeaknessLikelihood(assetId, vulnType) {
        const asset = await this.getAsset(assetId);
        if (!asset || !asset.embedding) {
            return { score: 0.0, confidence: 'low', rationale: 'Asset not found or no embedding' };
        }

        // Heuristic: Check K-nearest neighbors for the same vulnerability
        const similar = await this.findSimilarAssets(JSON.parse(asset.embedding), 10);
        if (similar.length === 0) return { score: 0.0, confidence: 'low', rationale: 'No similar assets found' };

        const affectedNeighbors = similar.filter(a => a.metadata.vulns?.includes(vulnType));
        const score = affectedNeighbors.length / similar.length;

        return {
            score: parseFloat(score.toFixed(2)),
            confidence: similar.length > 5 ? 'high' : 'medium',
            similar_affected: affectedNeighbors.length,
            total_neighbors: similar.length,
            rationale: `${affectedNeighbors.length}/${similar.length} similar assets have ${vulnType}`
        };
    }

    async getAsset(assetId) {
        const { rows } = await this.pool.query('SELECT * FROM assets WHERE id = $1', [assetId]);
        return rows[0];
    }
}

function createIntelligenceGraph(deps) {
    return new IntelligenceGraph(deps);
}

module.exports = { createIntelligenceGraph, IntelligenceGraph };
