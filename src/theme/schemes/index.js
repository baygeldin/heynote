// @ts-check
import grey from "./grey.js"
import red from "./red.js"
import orange from "./orange.js"
import yellow from "./yellow.js"
import green from "./green.js"
import blue from "./blue.js"
import indigo from "./indigo.js"
import violet from "./violet.js"

/** @type {import("../types").ColorScheme[]} */
export const COLOR_SCHEMES = [grey, red, orange, yellow, green, blue, indigo, violet]

/** @param {unknown} color */
export function normalizeColorScheme(color) {
    return COLOR_SCHEMES.find(scheme => scheme.id === color)?.id || "grey"
}

/** @param {unknown} color */
export function getColorScheme(color) {
    return COLOR_SCHEMES.find(scheme => scheme.id === normalizeColorScheme(color)) || grey
}
