import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  speed: number;
  text: string;
  opacity: number;
}

const TerminalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Encrypted text possibilities
    const encryptedChars = [
      // Binary
      '0', '1', '00', '01', '10', '11',
      // Hex
      '0x', 'A1', 'B2', 'C3', 'D4', 'E5', 'F6',
      // Military codes
      'ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO',
      // Encrypted symbols
      '█', '▓', '▒', '░', '▄', '▀',
      // Random chars
      '>', '<', '/', '\\', '|', '-', '+', '*',
      // Coordinates
      'N28°', 'E77°', 'LAT', 'LON',
      // Status codes
      'OK', 'ERR', '404', '200', '500',
      // Crypto
      'AES', 'RSA', 'SHA', 'MD5',
      // Commands
      'SSH', 'VPN', 'TLS', 'SSL',
      // Data
      '{', '}', '[', ']', '(', ')',
    ];

    const militaryCodes = [
      'CLASSIFIED',
      'TOP_SECRET',
      'ENCRYPTED',
      'SECURE_CHANNEL',
      'DEFENSE_NET',
      'COMM_LINK',
      'ALPHA_TEAM',
      'BRAVO_SQUAD',
      'OPERATION_SHIELD',
      'STATUS: ACTIVE',
      'CONN: SECURE',
      'ENC: AES-256',
      'AUTH: VERIFIED',
      'SIGNAL: STRONG',
    ];

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

    for (let i = 0; i < particleCount; i++) {
      const useLongText = Math.random() > 0.7;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        speed: 0.5 + Math.random() * 2,
        text: useLongText
          ? militaryCodes[Math.floor(Math.random() * militaryCodes.length)]
          : encryptedChars[Math.floor(Math.random() * encryptedChars.length)],
        opacity: 0.1 + Math.random() * 0.6,
      });
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      // Create trail effect
      ctx.fillStyle = 'rgba(10, 14, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Draw particle
        ctx.font = particle.text.length > 5 ? '10px "JetBrains Mono", monospace' : '14px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(0, 255, 65, ${particle.opacity})`;
        ctx.fillText(particle.text, particle.x, particle.y);

        // Add glow effect for some particles
        if (particle.opacity > 0.4) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff41';
          ctx.fillText(particle.text, particle.x, particle.y);
          ctx.shadowBlur = 0;
        }

        // Update position
        particle.y += particle.speed;

        // Reset particle when it goes off screen
        if (particle.y > canvas.height + 20) {
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
          const useLongText = Math.random() > 0.7;
          particle.text = useLongText
            ? militaryCodes[Math.floor(Math.random() * militaryCodes.length)]
            : encryptedChars[Math.floor(Math.random() * encryptedChars.length)];
          particle.opacity = 0.1 + Math.random() * 0.6;
          particle.speed = 0.5 + Math.random() * 2;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ backgroundColor: '#0a0e0a' }}
    />
  );
};

export default TerminalBackground;
