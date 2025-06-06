@echo off
echo Installing Morocco Made Real MVP dependencies...

npm install

echo.
echo Setting up Tailwind CSS...
npx tailwindcss init -p

echo.
echo Creating TypeScript config...
echo { > tsconfig.json
echo   "compilerOptions": { >> tsconfig.json
echo     "target": "es5", >> tsconfig.json
echo     "lib": ["dom", "dom.iterable", "es6"], >> tsconfig.json
echo     "allowJs": true, >> tsconfig.json
echo     "skipLibCheck": true, >> tsconfig.json
echo     "strict": true, >> tsconfig.json
echo     "forceConsistentCasingInFileNames": true, >> tsconfig.json
echo     "noEmit": true, >> tsconfig.json
echo     "esModuleInterop": true, >> tsconfig.json
echo     "module": "esnext", >> tsconfig.json
echo     "moduleResolution": "node", >> tsconfig.json
echo     "resolveJsonModule": true, >> tsconfig.json
echo     "isolatedModules": true, >> tsconfig.json
echo     "jsx": "preserve", >> tsconfig.json
echo     "incremental": true, >> tsconfig.json
echo     "plugins": [ >> tsconfig.json
echo       { >> tsconfig.json
echo         "name": "next" >> tsconfig.json
echo       } >> tsconfig.json
echo     ], >> tsconfig.json
echo     "paths": { >> tsconfig.json
echo       "@/*": ["./src/*"] >> tsconfig.json
echo     } >> tsconfig.json
echo   }, >> tsconfig.json
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], >> tsconfig.json
echo   "exclude": ["node_modules"] >> tsconfig.json
echo } >> tsconfig.json

echo.
echo Morocco Made Real MVP setup complete!
echo Run "npm run dev" to start the development server.
pause 