// @ts-check
import grey from "./grey.js"
import red from "./red.js"
import orange from "./orange.js"
import green from "./green.js"
import teal from "./teal.js"
import blue from "./blue.js"
import purple from "./purple.js"
import pink from "./pink.js"

/** @type {import("../types").ColorScheme[]} */
export const COLOR_SCHEMES = [grey, red, orange, green, teal, blue, purple, pink]

/** @param {unknown} color */
export function normalizeColorScheme(color) {
    return COLOR_SCHEMES.find(scheme => scheme.id === color)?.id || "grey"
}

/** @param {unknown} color */
export function getColorScheme(color) {
    return COLOR_SCHEMES.find(scheme => scheme.id === normalizeColorScheme(color)) || grey
}
