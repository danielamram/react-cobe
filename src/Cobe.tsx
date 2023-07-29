import { Leva, useControls, button } from "leva";
import { useRef, useEffect } from "react";
import create from "cobe";
import { toRgbString } from "./utils";

const Cobe = () => {
  const canvasRef = useRef();
  const pause = useRef(false);
  const paramsRef = useRef({});
  paramsRef.current = useControls({
    phi: { value: 0, min: 0, max: Math.PI * 2 },
    theta: { value: 0, min: -Math.PI / 2, max: Math.PI / 2 },
    mapSamples: { value: 16000, min: 500, max: 100000 },
    mapBrightness: { value: 6, min: 0, max: 12 },
    mapBaseBrightness: { value: 0, min: 0, max: 1 },
    diffuse: { value: 1.2, min: 0, max: 5 },
    dark: { value: 1, min: 0, max: 1 },
    baseColor: { r: 60, g: 60, b: 60 },
    markerColor: { r: 255, g: 255, b: 255 },
    markerSize: { value: 0.05, min: 0, max: 0.1 },
    glowColor: { r: 255, g: 255, b: 255 },
    scale: { value: 1, min: 0, max: 4 },
    offsetX: { value: 0, min: -1, max: 1 },
    offsetY: { value: 0, min: -1, max: 1 },
    opacity: { value: 0.9, min: 0, max: 1 },
    backgroundColor: { r: 255, g: 255, b: 255, a: 1 },
    "Toggle Rotation": button(() => {
      pause.current = !pause.current;
    })
  });
  const backgroundColor = toRgbString(paramsRef?.current?.backgroundColor);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const size = Math.min(window.innerHeight, window.innerWidth, 800);
    let r = 0;
    canvas.width = size * 2;
    canvas.height = size * 2;
    const p = create(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0,
      diffuse: 1.2,
      mapSamples: paramsRef.current.mapSamples,
      mapBrightness: paramsRef.current.mapBrightness,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.5, 1],
      glowColor: [1, 1, 1],
      markers: [],
      onRender: (state) => {
        state.dark = paramsRef.current.dark;
        state.phi = paramsRef.current.phi + r;
        if (!pause.current) r += 0.003;
        state.theta = paramsRef.current.theta;
        state.mapSamples = paramsRef.current.mapSamples;
        state.mapBrightness = paramsRef.current.mapBrightness;
        state.mapBaseBrightness = paramsRef.current.mapBaseBrightness;
        state.diffuse = paramsRef.current.diffuse;
        state.baseColor = [
          paramsRef.current.baseColor.r / 255,
          paramsRef.current.baseColor.g / 255,
          paramsRef.current.baseColor.b / 255
        ];
        state.markerColor = [
          paramsRef.current.markerColor.r / 255,
          paramsRef.current.markerColor.g / 255,
          paramsRef.current.markerColor.b / 255
        ];
        state.glowColor = [
          paramsRef.current.glowColor.r / 255,
          paramsRef.current.glowColor.g / 255,
          paramsRef.current.glowColor.b / 255
        ];
        state.markers = [
          { location: [37.7595, -122.4367] },
          { location: [40.7128, -74.006] },
          { location: [52.520008, 13.404954] },
          { location: [51.507351, -0.127758] },
          { location: [35.689487, 139.691711] },
          { location: [22.396427, 114.109497] },
          { location: [30.047503, 31.233702] },
          { location: [-33.86882, 151.20929] },
          { location: [-9.746956, -44.261249] }
        ].map((marker) => ({ ...marker, size: paramsRef.current.markerSize }));
        state.scale = paramsRef.current.scale;
        state.offset = [
          paramsRef.current.offsetX * size * 4,
          paramsRef.current.offsetY * size * 4
        ];
        state.opacity = paramsRef.current.opacity;
      }
    });
    return () => {
      p.destroy();
    };
  }, []);

  return (
    <>
      <div style={{ position: "absolute", right: 20, top: 20 }}>
        <Leva fill />
      </div>
      <canvas
        ref={canvasRef}
        style={{
          width: "min(100vmin, 800px)",
          height: "min(100vmin, 800px)",
          margin: "20px auto",
          backgroundColor
        }}
      />
    </>
  );
};

export default Cobe;
