#!/usr/bin/env python3
"""
Overleaf LaTeX Compiler Script
Uses pyoverleaf to interact with Overleaf and compile LaTeX documents.

Usage:
    python compile_latex.py resume_ml.tex [project_id]

Requirements:
    pip3 install pyoverleaf
"""

import os
import sys
import time
from pathlib import Path

try:
    import pyoverleaf
except ImportError:
    print("Installing pyoverleaf...")
    os.system("pip3 install pyoverleaf")
    import pyoverleaf


def list_projects():
    """List all Overleaf projects."""
    api = pyoverleaf.Api()
    api.login_from_browser()
    
    projects = api.get_projects()
    print("\n📂 Your Overleaf Projects:")
    print("-" * 60)
    for p in projects:
        print(f"  {p.name}")
        print(f"    ID: {p.id}")
        print(f"    URL: https://www.overleaf.com/project/{p.id}")
        print()
    return projects


def compile_with_overleaf(tex_file: str, project_id: str = None, output_dir: str = "."):
    """
    Compile a LaTeX file using Overleaf.
    
    Args:
        tex_file: Path to the .tex file
        project_id: Overleaf project ID to use (if None, uses first available or creates via web)
        output_dir: Directory to save the compiled PDF
    """
    tex_path = Path(tex_file)
    if not tex_path.exists():
        print(f"Error: {tex_file} not found!")
        return False
    
    print(f"📄 Loading: {tex_file}")
    
    # Read the LaTeX content
    with open(tex_path, 'r') as f:
        latex_content = f.read()
    
    print("🔑 Connecting to Overleaf...")
    
    try:
        api = pyoverleaf.Api()
        api.login_from_browser()
        print("✅ Logged in via browser cookies")
        
        # Get projects
        projects = api.get_projects()
        
        if project_id:
            # Use specified project
            project = next((p for p in projects if p.id == project_id), None)
            if not project:
                print(f"❌ Project {project_id} not found!")
                return False
        else:
            # Look for ML_Resume project or use first available
            project = next((p for p in projects if 'resume' in p.name.lower() or 'ml' in p.name.lower()), None)
            if not project and projects:
                project = projects[0]
            if not project:
                print("❌ No projects found! Please create one on Overleaf first.")
                print("   Go to: https://www.overleaf.com/project")
                print("   Then run: python3 compile_latex.py resume_ml.tex <project_id>")
                return False
        
        print(f"📁 Using project: {project.name} (ID: {project.id})")
        print(f"   URL: https://www.overleaf.com/project/{project.id}")
        
        # Get existing files in project (returns a ProjectFolder object)
        root_folder = api.project_get_files(project.id)
        print(f"   Retrieved project structure (root folder: {root_folder.id})")
        
        # Upload the LaTeX file as main.tex to root folder
        print("📤 Uploading LaTeX file as main.tex...")
        api.project_upload_file(project.id, root_folder.id, "main.tex", latex_content.encode())
        print("✅ File uploaded!")
        
        # Wait for compilation
        print("🔨 Waiting for compilation (10 seconds)...")
        time.sleep(10)
        
        # Download the project (includes compiled PDF)
        output_path = Path(output_dir) / f"{tex_path.stem}.zip"
        print(f"📥 Downloading project to: {output_path}")
        
        zip_content = api.download_project(project.id)
        with open(output_path, 'wb') as f:
            f.write(zip_content)
        
        print(f"✅ Project downloaded to: {output_path}")
        
        # Extract PDF from zip
        import zipfile
        with zipfile.ZipFile(output_path, 'r') as zip_ref:
            pdf_files = [f for f in zip_ref.namelist() if f.endswith('.pdf')]
            if pdf_files:
                pdf_name = pdf_files[0]
                pdf_content = zip_ref.read(pdf_name)
                pdf_path = Path(output_dir) / f"{tex_path.stem}.pdf"
                with open(pdf_path, 'wb') as f:
                    f.write(pdf_content)
                print(f"✅ PDF extracted to: {pdf_path}")
            else:
                print("⚠️  No PDF found in download - compilation may have failed")
                print("   Check the project on Overleaf for errors:")
                print(f"   https://www.overleaf.com/project/{project.id}")
        
        # Remove the zip
        os.remove(output_path)
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def alternative_local_compile(tex_file: str):
    """Try to compile locally using pdflatex if available."""
    import subprocess
    
    tex_path = Path(tex_file)
    
    pdflatex_paths = [
        "/Library/TeX/texbin/pdflatex",
        "/usr/local/texlive/2024/bin/universal-darwin/pdflatex",
        "/usr/local/bin/pdflatex",
        "/opt/homebrew/bin/pdflatex",
        "pdflatex"
    ]
    
    pdflatex = None
    for path in pdflatex_paths:
        try:
            result = subprocess.run([path, "--version"], capture_output=True, timeout=5)
            if result.returncode == 0:
                pdflatex = path
                break
        except:
            continue
    
    if not pdflatex:
        print("⚠️  pdflatex not found locally")
        return False
    
    print(f"🔨 Compiling with local pdflatex: {pdflatex}")
    
    try:
        for i in range(2):
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", str(tex_path)],
                cwd=tex_path.parent,
                capture_output=True,
                timeout=60
            )
        
        pdf_path = tex_path.with_suffix('.pdf')
        if pdf_path.exists():
            print(f"✅ Success! PDF created: {pdf_path}")
            return True
        else:
            print("❌ Compilation failed")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("=" * 60)
    print("📝 LaTeX Compiler Script (Overleaf)")
    print("=" * 60)
    
    if len(sys.argv) < 2 or sys.argv[1] == "--list":
        list_projects()
        print("\nUsage: python3 compile_latex.py <tex_file> [project_id]")
        return
    
    tex_file = sys.argv[1]
    project_id = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Try local compilation first
    print("\n🔧 Attempting local compilation...")
    if alternative_local_compile(tex_file):
        return
    
    # Fall back to Overleaf
    print("\n☁️  Attempting Overleaf compilation...")
    compile_with_overleaf(tex_file, project_id)


if __name__ == "__main__":
    main()
