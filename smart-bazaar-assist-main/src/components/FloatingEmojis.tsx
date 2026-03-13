import { motion } from 'framer-motion';

const emojis = [
  { emoji: '🍎', delay: 0, duration: 6 },
  { emoji: '🥦', delay: 1, duration: 7 },
  { emoji: '🥛', delay: 2, duration: 8 },
  { emoji: '🍞', delay: 0.5, duration: 6.5 },
  { emoji: '🍊', delay: 1.5, duration: 7.5 },
  { emoji: '🥚', delay: 2.5, duration: 8.5 },
  { emoji: '🧈', delay: 0.8, duration: 6.8 },
  { emoji: '🍓', delay: 1.8, duration: 7.8 },
];

const FloatingEmojis = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-20"
          initial={{ 
            x: Math.random() * 100 + '%',
            y: '100%',
            rotate: 0,
          }}
          animate={{
            y: '-10%',
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: `${(index * 12) + 5}%`,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingEmojis;
