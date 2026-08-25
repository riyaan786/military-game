// ======================================================
// mapChunkSystem.js — Chunked World Map Renderer
// ======================================================
//
// PURPOSE:
// - Load the full high-res 43k world map into an offscreen canvas
// - Divide it into virtual chunks
// - Only render chunks visible in the current viewport
// - CMO-style: high detail only where you're looking
//
// ======================================================

const CHUNK_SIZE = 1024; // pixels per chunk
let offscreenCanvas = null;
let octx = null;
let mapMetadata = { width: 0, height: 0, cols: 0, rows: 0, loaded: false };
let lowResCanvas = null;
let lowResCtx = null;
let fullMapImage = null;

// ======================================================
// INIT — renders full map into offscreen canvas once
// ======================================================
function initMapChunks(mapImage) {
    fullMapImage = mapImage;
    const W = mapImage.naturalWidth;
    const H = mapImage.naturalHeight;
    
    // Create offscreen canvas at native resolution
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = W;
    offscreenCanvas.height = H;
    octx = offscreenCanvas.getContext('2d');
    octx.drawImage(mapImage, 0, 0);
    
    // Create a low-res version for zoomed-out view
    lowResCanvas = document.createElement('canvas');
    lowResCanvas.width = Math.min(W, 7200);
    lowResCanvas.height = Math.min(H, 3600);
    lowResCtx = lowResCanvas.getContext('2d');
    lowResCtx.drawImage(mapImage, 0, 0, lowResCanvas.width, lowResCanvas.height);
    
    mapMetadata = {
        width: W,
        height: H,
        cols: Math.ceil(W / CHUNK_SIZE),
        rows: Math.ceil(H / CHUNK_SIZE),
        loaded: true
    };
    
    console.log(`MapChunkSystem: ${W}x${H}, ${mapMetadata.cols}x${mapMetadata.rows} chunks`);
    return mapMetadata;
}

// ======================================================
// RENDER — only draws chunks inside the viewport
// ======================================================
function renderVisibleChunks(ctx, camX, camY, zoom, screenW, screenH) {
    if (!mapMetadata.loaded) return;
    
    const W = mapMetadata.width;
    const H = mapMetadata.height;
    
    // Calculate visible world-space rectangle
    const halfW = (screenW / 2) / zoom;
    const halfH = (screenH / 2) / zoom;
    const vpLeft = camX - halfW;
    const vpTop = camY - halfH;
    const vpRight = camX + halfW;
    const vpBottom = camY + halfH;
    
    // Determine which chunks are visible
    const startCol = Math.max(0, Math.floor(vpLeft / CHUNK_SIZE));
    const endCol = Math.min(mapMetadata.cols, Math.ceil(vpRight / CHUNK_SIZE));
    const startRow = Math.max(0, Math.floor(vpTop / CHUNK_SIZE));
    const endRow = Math.min(mapMetadata.rows, Math.ceil(vpBottom / CHUNK_SIZE));
    
    // At low zoom, use the low-res version (much faster)
    if (zoom < 0.15) {
        ctx.drawImage(lowResCanvas, 0, 0, W, H);
        return;
    }
    
    // At medium-high zoom, render only visible chunks from full-res
    for (let col = startCol; col < endCol; col++) {
        for (let row = startRow; row < endRow; row++) {
            const sx = col * CHUNK_SIZE;
            const sy = row * CHUNK_SIZE;
            const sw = Math.min(CHUNK_SIZE, W - sx);
            const sh = Math.min(CHUNK_SIZE, H - sy);
            
            ctx.drawImage(
                offscreenCanvas,
                sx, sy, sw, sh,  // source region
                sx, sy, sw, sh   // destination region (world coords)
            );
        }
    }
}

// ======================================================
// GET PIXEL COLOR (for terrain detection, etc.)
// ======================================================
function getMapPixelColor(worldX, worldY) {
    if (!mapMetadata.loaded || !offscreenCanvas) return null;
    const px = Math.round(worldX);
    const py = Math.round(worldY);
    if (px < 0 || px >= mapMetadata.width || py < 0 || py >= mapMetadata.height) return null;
    try {
        const p = octx.getImageData(px, py, 1, 1).data;
        return { r: p[0], g: p[1], b: p[2], a: p[3] };
    } catch(e) { return null; }
}

// ======================================================
// EXPORT
// ======================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMapChunks,
        renderVisibleChunks,
        getMapPixelColor,
        CHUNK_SIZE
    };
}