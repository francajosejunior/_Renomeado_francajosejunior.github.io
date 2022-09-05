import React from "react";
import "../css/particles.css";
interface ParticlesProps {
  children: React.ReactNode;
}

export const Particles: React.FC<ParticlesProps> = ({ children }) => {
  return (
    <>
      <div className="page-bg"></div>
      <div className="animation-wrapper">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>
      <div className="page-wrapper">{children}</div>
    </>
  );
};

export default Particles;
