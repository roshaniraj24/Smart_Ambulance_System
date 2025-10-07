import React, { useEffect, useRef } from 'react';

const ECGMonitor = ({ heartRate }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dataPoints = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let x = 0;

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Generate ECG-like waveform
      const centerY = canvas.height / 2;
      const amplitude = canvas.height * 0.3;
      
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < canvas.width; i += 2) {
        const progress = (i + x) % canvas.width;
        let y = centerY;

        // Create ECG pattern
        if (progress % 100 < 20) {
          // QRS complex
          const qrsProgress = (progress % 100) / 20;
          if (qrsProgress < 0.3) {
            y = centerY + amplitude * 0.2 * Math.sin(qrsProgress * Math.PI * 10);
          } else if (qrsProgress < 0.7) {
            y = centerY - amplitude * Math.sin((qrsProgress - 0.3) * Math.PI * 2.5);
          } else {
            y = centerY + amplitude * 0.1 * Math.sin((qrsProgress - 0.7) * Math.PI * 5);
          }
        } else {
          // Baseline with slight noise
          y = centerY + (Math.random() - 0.5) * amplitude * 0.05;
        }

        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }

      ctx.stroke();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
      ctx.lineWidth = 1;
      
      // Horizontal grid
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Vertical grid
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      x += 2;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [heartRate]);

  return (
    <div className="ecg-monitor">
      <canvas ref={canvasRef} className="ecg-canvas" />
      
      <style jsx>{`
        .ecg-monitor {
          width: 100%;
          height: 200px;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
        }

        .ecg-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default ECGMonitor;
