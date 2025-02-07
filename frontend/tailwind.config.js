/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
		  fontFamily: {
			poppins: ['poppins', "sans-serif"],
			heebo: ['heebo','sans-serif'],
			openSans: ['opensans' ,'sans-serif'],
			Raleway: ['Raleway','sans-serif'],
			DMSans: ['DM Sans','sans-serif'],
			pathwayExtreme: ['Pathway Extreme'],
			ProtestStrike: ['Protest Strike'],
			SpicyRice: ['Spicy Rice'],
			powerGrotesk: ['PowerGrotesk-Regular', 'sans-serif'],
			outfit: ['Outfit-VariableFont_wght', 'sans-serif']
				   // Add more custom font families as needed
		  },
		  spacing: {
			'response-box-h': '27rem',
			'responsive-box-w': '40rem',
			'input-box-w': '52rem',
			'mobile-sidebar-height': "56rem",
			'mobile-main-height': "54rem",
		  },
	
		  keyframes: {
			slideIn: {
			  '0%': { transform: 'translateX(-100%)' },
			  '100%': { transform: 'translateX(0)' },
			},
			slideOUt: {
			  '0%': { transform: 'translateX(0)' },
			  '100%': { transform: 'translateX(-100%)' },
			},
			infiniteSlider: {
			  from: {transform: 'translateX(0)'},
			  to: {transform: 'translateX(-100%)'},
			}
		  },
		  animation: {
			slideIn: 'slideIn 0.3s ease-out forwards',
			slideOut: 'slideOut 0.3s ease-out forwards',
			['infinite-slider']: 'infiniteSlider 25s linear infinite',
		  },
		  maskImage: {
			'fade-right': 'linear-gradient(90deg, black 30%, transparent)',
		  },
		  WebkitMaskImage: {
			'fade-right': 'linear-gradient(90deg, black 30%, transparent)',
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

