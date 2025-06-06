#!/usr/bin/env node

/**
 * Morocco Made Real - WhatsApp Verification Production Setup
 * 
 * This script helps configure the WhatsApp verification system for production deployment.
 * It checks requirements, validates configuration, and provides setup guidance.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🇲🇦 Morocco Made Real - WhatsApp Verification Production Setup');
console.log('================================================================\n');

// Configuration checklist
const productionChecklist = {
  environment: {
    name: 'Environment Variables',
    checks: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY',
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'TWILIO_PHONE_NUMBER'
    ],
    optional: [
      'WHATSAPP_BUSINESS_API_TOKEN',
      'WHATSAPP_BUSINESS_PHONE_ID',
      'WHATSAPP_WEBHOOK_VERIFY_TOKEN'
    ]
  },
  database: {
    name: 'Database Schema',
    checks: [
      'tourist_profiles table exists',
      'whatsapp_qr_sessions table exists',
      'RLS policies configured',
      'Indexes created'
    ]
  },
  services: {
    name: 'External Services',
    checks: [
      'Supabase project configured',
      'Twilio account active',
      'Domain SSL certificate',
      'Webhook endpoints accessible'
    ]
  }
};

function checkEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...\n');
  
  const envPath = path.join(process.cwd(), '.env.local');
  const envTemplatePath = path.join(process.cwd(), 'env.template');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local not found');
    if (fs.existsSync(envTemplatePath)) {
      console.log('💡 Copy env.template to .env.local and configure your values:');
      console.log('   cp env.template .env.local\n');
    }
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = productionChecklist.environment.checks;
  const optionalVars = productionChecklist.environment.optional;
  
  let allRequired = true;
  
  console.log('Required Variables:');
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`) && 
                   !envContent.includes(`${varName}=your_`) &&
                   !envContent.includes(`${varName}=`);
    
    console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`);
    if (!hasVar) allRequired = false;
  });
  
  console.log('\nOptional Variables (for advanced features):');
  optionalVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`) && 
                   !envContent.includes(`${varName}=your_`);
    
    console.log(`  ${hasVar ? '✅' : '⚪'} ${varName}`);
  });
  
  console.log('');
  return allRequired;
}

function checkDatabaseSchema() {
  console.log('🗄️  Checking Database Schema...\n');
  
  const migrationFiles = [
    'supabase/migrations/001_tourist_profiles.sql',
    'supabase/migrations/002_whatsapp_qr_sessions.sql'
  ];
  
  let allMigrationsExist = true;
  
  migrationFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allMigrationsExist = false;
  });
  
  if (allMigrationsExist) {
    console.log('\n💡 Run migrations in Supabase Dashboard or using CLI:');
    console.log('   supabase db push\n');
  } else {
    console.log('\n❌ Missing migration files\n');
  }
  
  return allMigrationsExist;
}

function checkPackageDependencies() {
  console.log('📦 Checking Package Dependencies...\n');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json not found\n');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredPackages = [
    'next',
    '@supabase/supabase-js',
    'twilio',
    'qrcode',
    '@types/qrcode'
  ];
  
  let allInstalled = true;
  
  requiredPackages.forEach(pkg => {
    const installed = dependencies[pkg];
    console.log(`  ${installed ? '✅' : '❌'} ${pkg}${installed ? ` (${installed})` : ''}`);
    if (!installed) allInstalled = false;
  });
  
  if (!allInstalled) {
    console.log('\n💡 Install missing packages:');
    console.log('   npm install\n');
  } else {
    console.log('\n✅ All required packages installed\n');
  }
  
  return allInstalled;
}

function generateProductionConfig() {
  console.log('⚙️  Generating Production Configuration...\n');
  
  const prodConfig = {
    // Environment-specific settings
    env: {
      NODE_ENV: 'production',
      SMS_PROVIDER: 'auto',
      ENABLE_SMART_METHOD_SELECTION: 'true',
      PREFER_WHATSAPP: 'false', // Let smart selection decide
      WHATSAPP_METHOD: 'link',
      SHOW_VERIFICATION_CODES: 'false',
      ENABLE_MOCK_VERIFICATION: 'false'
    },
    
    // WhatsApp Business API setup guide
    whatsappSetup: {
      steps: [
        '1. Create Facebook Developer Account (developers.facebook.com)',
        '2. Create a new App → Add WhatsApp Business API',
        '3. Generate Access Token',
        '4. Add Phone Number to WhatsApp Business Account',
        '5. Create Message Template for verification codes',
        '6. Set Webhook URL: https://yourdomain.com/api/whatsapp-webhook',
        '7. Configure Webhook Verify Token'
      ]
    },
    
    // Deployment checklist
    deployment: {
      steps: [
        '1. Set all environment variables in hosting platform',
        '2. Run database migrations',
        '3. Configure domain and SSL certificate',
        '4. Test webhook endpoints',
        '5. Verify WhatsApp Business API connection',
        '6. Test end-to-end verification flow',
        '7. Monitor logs and error rates'
      ]
    }
  };
  
  // Write configuration guide
  const configPath = path.join(process.cwd(), 'PRODUCTION_SETUP.md');
  const configContent = `# Production Setup Guide

## Environment Variables
\`\`\`bash
${Object.entries(prodConfig.env).map(([key, value]) => `${key}=${value}`).join('\n')}
\`\`\`

## WhatsApp Business API Setup
${prodConfig.whatsappSetup.steps.map(step => `- ${step}`).join('\n')}

## Deployment Checklist
${prodConfig.deployment.steps.map(step => `- [ ] ${step}`).join('\n')}

## Testing Production Setup

### 1. Test Basic Verification
\`\`\`bash
curl -X POST https://yourdomain.com/api/verify-phone \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+212612345678", "method": "whatsapp"}'
\`\`\`

### 2. Test QR Auto-Validation
Visit: \`https://yourdomain.com/en/test-whatsapp-qr\`

### 3. Monitor Dashboard
Visit: \`https://yourdomain.com/en/admin/whatsapp\`

## Support
- Documentation: ./WHATSAPP_VERIFICATION_SETUP.md
- Test Page: /en/test-whatsapp-qr
- Admin Dashboard: /en/admin/whatsapp
`;

  fs.writeFileSync(configPath, configContent);
  console.log(`✅ Production setup guide created: ${configPath}\n`);
  
  return true;
}

function runDiagnostics() {
  console.log('🔧 Running System Diagnostics...\n');
  
  const results = {
    env: checkEnvironmentVariables(),
    packages: checkPackageDependencies(),
    database: checkDatabaseSchema()
  };
  
  const setupComplete = generateProductionConfig();
  
  console.log('📊 Setup Summary:');
  console.log('================');
  console.log(`Environment Variables: ${results.env ? '✅ Ready' : '❌ Needs configuration'}`);
  console.log(`Package Dependencies: ${results.packages ? '✅ Ready' : '❌ Needs installation'}`);
  console.log(`Database Schema: ${results.database ? '✅ Ready' : '❌ Needs migration'}`);
  console.log(`Production Config: ${setupComplete ? '✅ Generated' : '❌ Failed'}`);
  
  const allReady = results.env && results.packages && results.database && setupComplete;
  
  console.log(`\n🎯 Overall Status: ${allReady ? '✅ READY FOR PRODUCTION' : '⚠️  NEEDS CONFIGURATION'}`);
  
  if (allReady) {
    console.log('\n🚀 Next Steps:');
    console.log('1. Review PRODUCTION_SETUP.md');
    console.log('2. Configure WhatsApp Business API (optional)');
    console.log('3. Deploy to your hosting platform');
    console.log('4. Test the verification flow');
    console.log('5. Monitor the admin dashboard');
    console.log('\n🌟 Your WhatsApp verification system is ready to help international tourists!');
  } else {
    console.log('\n📝 Action Required:');
    if (!results.env) console.log('- Configure environment variables in .env.local');
    if (!results.packages) console.log('- Install missing npm packages');
    if (!results.database) console.log('- Run database migrations');
    console.log('\nRun this script again after completing the above steps.');
  }
  
  return allReady;
}

// Main execution
if (require.main === module) {
  try {
    const success = runDiagnostics();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  runDiagnostics,
  checkEnvironmentVariables,
  checkDatabaseSchema,
  checkPackageDependencies,
  generateProductionConfig
}; 