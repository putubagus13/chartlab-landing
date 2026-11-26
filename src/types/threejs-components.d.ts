declare module 'threejs-components/build/cursors/tubes1.min.js' {
  export type TubesApp = {
    tubes: { setColors(colors: string[]): void; setLightsColors(colors: string[]): void }
    dispose(): void
  }
  const TubesCursor: (
    canvas: HTMLCanvasElement,
    options?: { tubes?: { colors?: string[]; lights?: { intensity?: number; colors?: string[] } } },
  ) => TubesApp
  export default TubesCursor
}
