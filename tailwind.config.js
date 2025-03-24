module.exports = {
  content: ['./src/**/*.{js,liquid}'],
  theme: {
    extend: {
      borderRadius: {
        medium: '0.375rem',
        large: '0.5rem',
        circle: '1.25rem',
      },
      fontSize: {
        h1: [
          '2.5rem',
          {
            lineHeight: '1.2',
            fontWeight: '600',
          },
        ],
        h2: [
          '2rem',
          {
            lineHeight: '1.3',
            fontWeight: '600',
          },
        ],
        h3: [
          '1.5rem',
          {
            lineHeight: '1.3',
            fontWeight: '600',
          },
        ],
        h4: [
          '1.25rem',
          {
            lineHeight: '1.4',
            fontWeight: '600',
          },
        ],
        h5: [
          '1.125rem',
          {
            lineHeight: '1.4',
            fontWeight: '600',
          },
        ],
        xxxs: [
          '0.5rem',
          {
            lineHeight: '1.2',
          },
        ],
        xxs: [
          '0.625rem',
          {
            lineHeight: '1.4',
          },
        ],
        xs: [
          '0.75rem',
          {
            lineHeight: '1.8',
          },
        ],
        lg: [
          '1.125rem',
          {
            lineHeight: '1.8',
          },
        ],
        xl: [
          '1.25rem',
          {
            lineHeight: '1.8',
          },
        ],
        md: [
          '1rem',
          {
            lineHeight: '1.8',
          },
        ],
        sm: [
          '0.875rem',
          {
            lineHeight: '1.8',
          },
        ]
      },
      lineHeight: {
        1: '1.1',
        1.5: '1.15',
        2: '1.2',
        2.5: '1.25',
        3: '1.3',
        3.5: '1.35',
        4: '1.4',
        4.5: '1.45',
        5: '1.5',
        5.5: '1.55',
        6: '1.6',
        6.5: '1.65',
        7: '1.7',
        7.5: '1.75',
        8: '1.8',
        8.5: '1.85',
        9: '1.9',
        9.5: '1.95',
        10: '2',
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        secondaryDark: 'var(--color-secondary-dark)',
        special: 'var(--color-special)',
        body: 'var(--color-body)',
        subtext: 'var(--color-subtext)',
        border: 'var(--color-border)',
        background: 'var(--color-background)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
        sale: 'var(--color-sale)',
        hot: 'var(--color-hot)',
        new: 'var(--color-new)',
        soldout: 'var(--color-sold-out)',
        overlay: 'rgba(0,0,0,0.5)'
      },
      spacing: {
        'container-desktop': 'var(--container-pading-desktop)',
        'container-tablet': 'var(--container-pading-tablet)',
        'container-mobile': 'var(--container-pading-mobile)',
        0.5: '0.125rem',
        0.75: '0.1875rem',
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        7.5: '1.875rem',
        12.5: '3.125rem',
        13: '3.25rem',
        14.5: '3.625rem',
        15: '3.75rem',
        17: '4.25rem',
        18: '4.5rem',
        19: '4.75rem',
        25: '6.375rem',
        26: '6.5rem',
        27: '6.75rem', 
        29: '7.25rem',
        31: '7.75rem',
        33: '8.25rem',
        37: '9.25rem',
        '1/2': '50%',
        '1/3': 'calc(100%/3)',
        '2/3': 'calc(200%/3)',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': 'calc(100%/6)',
        '5/6': 'calc(500%/6)',
        search: 'calc(100% - 46px)',
      },
      width: {
        0.25: '0.0625rem',
        9.5: '2.375rem',
        10.5: '2.625rem',
        13.5: '3.375rem',
        37.5: '9.375rem',
        47.5: '11.875rem',
        87.75: '21.4375rem',
        97.5: '24.375rem',
        99.5: '24.875rem',
        'slide-2': 'calc((100% - 10px)/2)',
        'slide-3': 'calc((100% - 20px)/3)',
        'slide-4': 'calc((100% - 30px)/4)',
        'slide-5': 'calc((100% - 40px)/5)',
      },
      height: {
        0.25: '0.0625rem',
        10.5: '2.625rem',
        13: '3.25rem',
        13.5: '3.375rem',
        16.5: '4.125rem',
        37.5: '9.375rem',
        47.5: '11.875rem',
        90: '22.5rem',
        97.5: '24.375rem',
      },
      boxShadow: {
        megamenu: '4px 4px 19px 0px rgba(198, 198, 198, 0.35)',
        search: '4px 10px 10px 0px rgba(217, 217, 217, 0.25)',
        select: '10px 10px 25px 10px rgba(0, 0, 0, 0.1)',
        note: '0px 2px 7px 0px rgba(0, 0, 0, 0.12)',
        popup: '0 20px 24px -4px rgba(16,24,40,.08), 0 8px 8px -4px rgba(16,24,40,.03)',
        tooltip: '0px 2px 7px 0px rgba(0, 0, 0, 0.12)',
        button: '1px 1px 3px hsla(0,0%,70%,.25)',
        box: '0px 4px 4px 0px rgba(231, 231, 231, 0.25)',
        card: '2px 4px 28px 0px rgba(163, 163, 163, 0.10)'
      },
      maxWidth: {
        '1/2': '50%',
        '1/3': 'calc(100%/3)',
        '2/3': 'calc(200%/3)',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': 'calc(100%/6)',
        '5/6': 'calc(500%/6)',
        facet: 'calc(100% - 4rem)',
        facetdt: '450px',
        62.5: '15.625rem',
        97.5: '24.375rem',
        132: '33rem',
        '2-col-variant': 'calc((100% - 0.5rem)/2)',
        '3-col-variant': 'calc((100% - 1rem)/3)',
        '6-col-variant': 'calc((100% - 2.5rem)/6)',
        '8-col-variant': 'calc((100% - 3.5rem)/8)',
        'main-article': 'calc(200%/3 - 5px)',
        'main-article-sidebar': 'calc(100%/3 + 5px)',
        'container': 'var(--page-width)',
        'container-2': 'var(--page-width-2)'
      },
      minWidth: {
        12: '3rem',
        '2-col-variant': 'calc((100% - 0.5rem)/2)',
        '3-col-variant': 'calc((100% - 1rem)/3)',
        '6-col-variant': 'calc((100% - 2.5rem)/6)',
      },
      maxHeight: {
        35: '8.75rem',
        90: '22.5rem',
        searchmb: 'calc(100vh - 100%)',
        searchdt: 'calc(100vh + 46px - 100%)',
        menudt: 'calc(100vh - 117px)',
        facetdt: 'calc(100vh - 12.5rem)'
      },
      translate: {
        'button-card': 'calc(100% + 1.25rem)',
        'facet-tl': 'calc(100% + 1.875rem)',
        'facet-dt': 'calc(100% + 3.125rem)',
      },
      backgroundImage: {
        'next': 'var(--next)',
        'prev': 'var(--prev)',
        'star': 'var(--star)',
        select: 'var(--select) no-repeat right white',
        'vertify': 'var(--vertify)',
        'down': 'var(--down)',
        'linkto': 'var(--linkto)',
        'image-placeholder': 'var(--image-placeholder)',
        'image-upload': 'var(--image-upload)',
        'image-favicon': 'var(--image-favicon)'
      },
      backgroundPosition: {
        select: 'calc(100% - 24px) 50%',
      },
      content: {
        empty: '""',
        freeship: 'var(--freeship)',
        eye: 'var(--eye)',
        dot: 'var(--dot)',
        close: 'var(--image-close)',
        'eye-hover': 'var(--eye-hover)',
        'prev': 'var(--prev)',
        shield: 'var(--shield)',
        select: 'var(--select)',
        'image-placeholder': 'var(--image-placeholder)',
        'image-logo': 'var(--image-logo)',
        'star': 'var(--star)',
        'star-half': 'var(--star-half)',
        'star-empty': 'var(--star-empty)',
        'badge-review': 'var(--badge-review)'
      },
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
        const generateOpacityClasses = (colorName) => {
            const classes = {};
            for (let i = 0; i <= 100; i++) {
                classes[`.bg-${colorName}-opacity-${i}`] = {
                    'background-color': `color-mix(in srgb, var(--color-${colorName}) ${i}%, transparent)`,
                };
                classes[`.text-${colorName}-opacity-${i}`] = {
                    'color': `color-mix(in srgb, var(--color-${colorName}) ${i}%, transparent)`,
                };
                classes[`.border-${colorName}-opacity-${i}`] = {
                    'border-color': `color-mix(in srgb, var(--color-${colorName}) ${i}%, transparent)`,
                };
            }
            return classes;
        };

        const newUtilities = {
            ...generateOpacityClasses('primary'),
            ...generateOpacityClasses('secondary'),
            ...generateOpacityClasses('body'),
            ...generateOpacityClasses('subtext'),
            ...generateOpacityClasses('border'),
            ...generateOpacityClasses('background'),
            ...generateOpacityClasses('overlay'),
            ...generateOpacityClasses('error'),
            ...generateOpacityClasses('warning'),
            ...generateOpacityClasses('success'),
            ...generateOpacityClasses('sale'),
            ...generateOpacityClasses('hot'),
            ...generateOpacityClasses('new'),
            ...generateOpacityClasses('soldout')
        };

        addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ]
};
