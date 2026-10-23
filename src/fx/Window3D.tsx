import React from 'react';
import { motion, MotionValue, useMotionValue, useTransform } from 'motion/react';

/**
 * A window built purely with CSS 3D transforms: an extruded steel frame,
 * an inner sash on a hinge (opens like a turn window) and a glass pane
 * showing a photo with a moving reflection.
 */
type Props = {
  image?: string;
  width?: number | string;
  height?: number | string;
  /** 0 = closed, 1 = fully open (sash swings ~70°) */
  open?: MotionValue<number>;
  rotateY?: MotionValue<number>;
  rotateX?: MotionValue<number>;
  depth?: number;
  bars?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Frame = ({ z, shade, thick }: { z: number; shade: number; thick: string }) => (
  <div
    className="absolute inset-0 rounded-[6px]"
    style={{
      transform: `translateZ(${z}px)`,
      border: `${thick} solid`,
      borderColor: `rgb(${shade} ${shade + 4} ${shade + 10})`,
      background: 'transparent',
    }}
  />
);

export const Window3D = ({ image, width = 320, height = 420, open, rotateY, rotateX, depth = 26, bars = true, className = '', children }: Props) => {
  const zero = useMotionValue(0);
  const openV = open ?? zero;
  const sashY = useTransform(openV, [0, 1], [0, -72]);
  const reflect = useTransform(rotateY ?? zero, [-60, 60], ['-40%', '140%']);
  const layers = Math.max(4, Math.round(depth / 3));

  return (
    <div className={className} style={{ perspective: 1400 }}>
      <motion.div
        className="relative"
        style={{ width, height, transformStyle: 'preserve-3d', rotateY: rotateY ?? 0, rotateX: rotateX ?? 0 }}
      >
        {/* extruded outer frame (stacked layers create real depth) */}
        {Array.from({ length: layers }, (_, i) => (
          <Frame key={i} z={-i * (depth / layers)} shade={i === 0 ? 200 : 60 + (layers - i) * 6} thick="clamp(10px,4%,18px)" />
        ))}
        {/* front face highlight */}
        <div className="absolute inset-0 rounded-[6px] pointer-events-none" style={{ transform: 'translateZ(1px)', border: 'clamp(10px,4%,18px) solid transparent', borderImage: 'linear-gradient(135deg,#f4f6f9,#8b929d 40%,#e2e6ec 60%,#6b7280) 1' }} />

        {/* hinged sash + glass */}
        <motion.div
          className="absolute"
          style={{ inset: 'clamp(10px,4%,18px)', transformStyle: 'preserve-3d', transformOrigin: 'left center', rotateY: sashY, translateZ: -depth * 0.35 }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[3px] bg-[#0b1220]" style={{ border: '6px solid #c9ced6', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.4)' }}>
            {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />}
            {children}
            {/* glass tint + reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-200/10 via-transparent to-blue-900/30" />
            <motion.div className="absolute -inset-y-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ left: reflect }} />
            {bars && (
              <>
                <div className="absolute left-1/2 top-0 bottom-0 w-[5px] -translate-x-1/2 bg-gradient-to-r from-[#9aa1ab] via-[#e5e8ed] to-[#8a919b]" />
                <div className="absolute top-[38%] left-0 right-0 h-[5px] bg-gradient-to-b from-[#9aa1ab] via-[#e5e8ed] to-[#8a919b]" />
              </>
            )}
            {/* handle */}
            <div className="absolute right-2 top-1/2 h-10 w-2 -translate-y-1/2 rounded-full bg-gradient-to-b from-zinc-200 to-zinc-500 shadow" />
          </div>
        </motion.div>

        {/* floor shadow */}
        <div className="absolute -bottom-16 left-[10%] right-[10%] h-10 rounded-[50%] bg-black/60 blur-2xl" style={{ transform: 'rotateX(90deg) translateZ(-40px)' }} />
      </motion.div>
    </div>
  );
};
