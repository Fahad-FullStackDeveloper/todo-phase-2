/**
 * Framer Motion Configuration
 *
 * Centralized animation settings for consistent motion design
 */

export const motionConfig = {
  // Transition defaults
  transition: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
    duration: 0.2,
  },

  // Animation variants
  variants: {
    // Fade animations
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },

    // Slide animations
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },

    // Scale animations
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },

    // Stagger container for lists
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },

    // List item animations
    listItem: {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 20,
        },
      },
    },

    // Modal animations
    modal: {
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 30,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
    },

    // Sidebar animations
    sidebar: {
      hidden: { x: -280, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
      exit: {
        x: -280,
        opacity: 0,
      },
    },

    // Dropdown animations
    dropdown: {
      hidden: { opacity: 0, y: -10, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 25,
        },
      },
      exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
      },
    },
  },

  // Hover animations
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },

  // Tap animations
  tap: {
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },

  // Layout animations
  layout: {
    layout: true,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },

  // Presence animations for AnimatePresence
  presence: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

// Export individual variants for convenience
export const {
  transition,
  variants,
  hover,
  tap,
  layout,
  presence,
} = motionConfig;

// Default animation props for components
export const defaultAnimateProps = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: variants.fade,
  transition: transition,
};
