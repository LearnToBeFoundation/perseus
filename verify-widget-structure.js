#!/usr/bin/env node

// Verification script for Enhanced Radio Widget structure
// This checks if our widget is properly built and includes nested widget support

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Enhanced Radio Widget Structure...\n');

// Check if source files exist
const sourceFiles = [
    'src/widgets/enhanced-radio/widget.jsx',
    'src/widgets/enhanced-radio/base-enhanced-radio.jsx', 
    'src/widgets/enhanced-radio/enhanced-choice.jsx',
    'src/widgets/enhanced-radio/editor.jsx',
    'src/widgets/enhanced-radio.jsx',
    'src/widgets/enhanced-radio-editor.jsx'
];

console.log('📁 Checking source files:');
sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING!`);
    }
});

// Check if widget is registered in extra-widgets.js
console.log('\n📋 Checking widget registration:');
try {
    const extraWidgets = fs.readFileSync('src/extra-widgets.js', 'utf8');
    
    if (extraWidgets.includes('enhanced-radio')) {
        console.log('  ✅ Enhanced radio widget is registered in extra-widgets.js');
    } else {
        console.log('  ❌ Enhanced radio widget NOT found in extra-widgets.js');
    }
    
    if (extraWidgets.includes('enhanced-radio-editor')) {
        console.log('  ✅ Enhanced radio editor is registered in extra-widgets.js');
    } else {
        console.log('  ❌ Enhanced radio editor NOT found in extra-widgets.js');
    }
} catch (error) {
    console.log('  ❌ Could not read extra-widgets.js');
}

// Check for traverseChildWidgets function
console.log('\n🔧 Checking nested widget support:');
try {
    const widgetFile = fs.readFileSync('src/widgets/enhanced-radio.jsx', 'utf8');
    
    if (widgetFile.includes('traverseChildWidgets')) {
        console.log('  ✅ traverseChildWidgets function found');
    } else {
        console.log('  ❌ traverseChildWidgets function MISSING');
    }
    
    if (widgetFile.includes('traverseRenderer')) {
        console.log('  ✅ traverseRenderer usage found');
    } else {
        console.log('  ❌ traverseRenderer usage MISSING');
    }
} catch (error) {
    console.log('  ❌ Could not read enhanced-radio.jsx');
}

// Check for apiOptions in widget
console.log('\n⚙️ Checking apiOptions support:');
try {
    const widgetFile = fs.readFileSync('src/widgets/enhanced-radio/widget.jsx', 'utf8');
    
    if (widgetFile.includes('apiOptions={this.props.apiOptions}')) {
        console.log('  ✅ apiOptions passed to Renderer');
    } else {
        console.log('  ❌ apiOptions NOT passed to Renderer');
    }
    
    if (widgetFile.includes('PropTypes.shape')) {
        console.log('  ✅ PropTypes properly defined');
    } else {
        console.log('  ❌ PropTypes may be missing');
    }
} catch (error) {
    console.log('  ❌ Could not read widget.jsx');
}

// Check built files
console.log('\n🏗️ Checking built files:');
const builtFiles = fs.readdirSync('.').filter(file => file.startsWith('perseus-') && file.endsWith('.js'));

if (builtFiles.length > 0) {
    console.log(`  ✅ Found ${builtFiles.length} built Perseus files`);
    
    // Check latest build for enhanced-radio
    const latestBuild = builtFiles.sort().pop();
    try {
        const buildContent = fs.readFileSync(latestBuild, 'utf8');
        
        if (buildContent.includes('enhanced-radio')) {
            console.log(`  ✅ Enhanced radio widget found in ${latestBuild}`);
        } else {
            console.log(`  ❌ Enhanced radio widget NOT found in ${latestBuild}`);
        }
        
        if (buildContent.includes('traverseChildWidgets')) {
            console.log(`  ✅ traverseChildWidgets found in build`);
        } else {
            console.log(`  ❌ traverseChildWidgets NOT found in build`);
        }
    } catch (error) {
        console.log(`  ❌ Could not read ${latestBuild}`);
    }
} else {
    console.log('  ❌ No built Perseus files found - run npm run prepare');
}

// Check CSS files
console.log('\n🎨 Checking CSS files:');
if (fs.existsSync('stylesheets/exercise-content-package/widgets/enhanced-radio.less')) {
    console.log('  ✅ Enhanced radio LESS file exists');
} else {
    console.log('  ❌ Enhanced radio LESS file MISSING');
}

if (fs.existsSync('perseus.css')) {
    console.log('  ✅ Built CSS file exists');
} else {
    console.log('  ❌ Built CSS file MISSING');
}

// Summary
console.log('\n📊 Summary:');
console.log('If all checks show ✅, the enhanced radio widget should work with nested widgets.');
console.log('If any show ❌, those issues need to be fixed before deployment.');

console.log('\n🚀 Next steps:');
console.log('1. If all checks pass, update your other app with this branch');
console.log('2. Test adding image widgets to enhanced radio choices');
console.log('3. Verify no console errors and widgets render properly');

console.log('\n📦 Update command for your other app:');
console.log('rm -rf node_modules package-lock.json yarn.lock');
console.log('npm install git+https://github.com/your-username/perseus.git#better-multiple-choice-widget');
