// Splash screen settings, shared by the head script, the component and the tests.

export const SPLASH_KEY = 'disatu-splash'
/** The intro never ends before this many ms after the page started loading, so the logo animation can play out. */
export const SPLASH_MIN_MS = 2000
/** How long the fade-out takes. Keep in sync with --splash-fade in styles.css. */
export const SPLASH_FADE_MS = 500

/**
 * Runs inline in <head>, before first paint. First visit in a browser session: remember it and show the splash.
 * Repeat visit (reload, language switch, back): flag <html data-splash="seen"> so CSS hides the splash at once.
 */
export const splashInitScript = `(function(){try{if(sessionStorage.getItem('${SPLASH_KEY}')){document.documentElement.dataset.splash='seen'}else{sessionStorage.setItem('${SPLASH_KEY}','1')}}catch(e){}})()`
