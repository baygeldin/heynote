import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import nodeApiHeaders from 'node-api-headers'

// Called by Vite after it clears dist-electron, for both development and builds.
export default function buildMacosWindow() {
    if (process.platform !== 'darwin') {
        return
    }
    const root = fileURLToPath(new URL('../../', import.meta.url))
    const outputDir = path.join(root, 'dist-electron/native')
    const output = path.join(outputDir, 'macos-window.node')
    mkdirSync(outputDir, {recursive: true})
    // Node-API is ABI stable: no Electron/V8 headers or runtime download is
    // needed. Build both architectures so all macOS packaging targets work.
    execFileSync('xcrun', [
        'clang++', '-std=c++17', '-bundle', '-undefined', 'dynamic_lookup',
        '-fobjc-arc', '-fblocks', '-DNAPI_VERSION=8',
        '-mmacosx-version-min=11.0', '-arch', 'arm64', '-arch', 'x86_64',
        '-I', nodeApiHeaders.include_dir,
        path.join(root, 'electron/native/macos-window.mm'),
        '-framework', 'Cocoa', '-o', output,
    ], {stdio: 'inherit'})
    execFileSync('codesign', ['--force', '--sign', '-', output], {stdio: 'inherit'})
}
