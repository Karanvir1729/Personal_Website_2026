import os
import time
import glob
import math
import random
from pathlib import Path
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
except ImportError:
    print("Please install required libraries: pip install google-generativeai python-dotenv")
    exit(1)

# Load environment variables from .env file
load_dotenv()


# Configuration
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-flash-latest"
DURATION_HOURS = 8
TARGET_FILE = "Documentation.md"
SOURCE_DIR = "src"
EXTENSIONS = [".ts", ".tsx", ".js", ".py"]

# Random comment configuration
RANDOM_COMMENT_MIN_INTERVAL = 60   # 1 minute
RANDOM_COMMENT_MAX_INTERVAL = 120  # 2 minutes

if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable is not set.")
    exit(1)

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(MODEL_NAME)

def get_all_files(directory, extensions):
    file_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_list.append(os.path.join(root, file))
    return file_list

def generate_comment(file_path, content):
    prompt = f"Analyze the following code file: {file_path}\n\nCode:\n{content}\n\nProvide 3-5 high-level bullet points summarizing what this code does. Be concise."
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error gathering comments for {file_path}: {e}"

def get_comment_syntax(file_path):
    """Return the appropriate comment syntax for the file type."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext in [".py"]:
        return "#", None  # Single line comment only
    elif ext in [".ts", ".tsx", ".js", ".jsx"]:
        return "//", ("/*", "*/")  # Single and multi-line
    else:
        return "//", None

def generate_random_inline_comment(file_path, content, line_content, line_number):
    """Use Gemini to generate a contextually relevant comment for a specific line."""
    prompt = f"""You are adding a helpful inline comment to a code file.

File: {file_path}
Line number: {line_number}
Line content: {line_content}

Context (surrounding code):
{content[:2000] if len(content) > 2000 else content}

Generate a SHORT, insightful inline comment (1 sentence max) that explains:
- What this line does, OR
- Why it's important, OR
- A tip or clarification about this code

Rules:
- Be concise (under 80 characters if possible)
- Be helpful and professional
- Don't state the obvious
- Make it sound like a developer wrote it
- Return ONLY the comment text, no comment symbols

Example good comments:
- "Prevents race condition with concurrent requests"
- "Cache key uses user ID for session isolation"
- "Early return optimization for empty arrays"
"""
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return None

def insert_random_comment(file_path):
    """Insert a random, contextually relevant comment into a file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False
    
    if len(lines) < 3:
        print(f"File too short: {file_path}")
        return False
    
    # Find valid lines to comment (skip empty lines, imports, and existing comments)
    valid_lines = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped and not stripped.startswith(("//", "#", "/*", "*", "import", "from", "export")):
            # Skip lines that are just brackets or single characters
            if len(stripped) > 3:
                valid_lines.append(i)
    
    if not valid_lines:
        print(f"No valid lines to comment in: {file_path}")
        return False
    
    # Pick a random line
    target_line_idx = random.choice(valid_lines)
    target_line = lines[target_line_idx]
    
    # Get comment syntax
    single_comment, _ = get_comment_syntax(file_path)
    
    # Get full content for context
    content = "".join(lines)
    
    # Generate a contextual comment using Gemini
    comment_text = generate_random_inline_comment(
        file_path, 
        content, 
        target_line.strip(), 
        target_line_idx + 1
    )
    
    if not comment_text:
        print(f"Failed to generate comment for {file_path}")
        return False
    
    # Clean up the comment text (remove any accidental comment symbols)
    comment_text = comment_text.strip().lstrip("/#*").strip()
    
    # Determine indentation of the target line
    indentation = len(target_line) - len(target_line.lstrip())
    indent_str = target_line[:indentation]
    
    # Create the comment line
    comment_line = f"{indent_str}{single_comment} {comment_text}\n"
    
    # Insert the comment above the target line
    lines.insert(target_line_idx, comment_line)
    
    # Write the file back
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(lines)
        print(f"✓ Added comment to {file_path} at line {target_line_idx + 1}")
        print(f"  Comment: {comment_text}")
        return True
    except Exception as e:
        print(f"Error writing {file_path}: {e}")
        return False

def run_random_commenter():
    """Main loop for random comment injection at 1-2 minute intervals."""
    print("=" * 60)
    print("RANDOM COMMENT INJECTOR")
    print("=" * 60)
    print(f"Source directory: {SOURCE_DIR}")
    print(f"File extensions: {EXTENSIONS}")
    print(f"Interval: {RANDOM_COMMENT_MIN_INTERVAL}-{RANDOM_COMMENT_MAX_INTERVAL} seconds")
    print("=" * 60)
    print("Press Ctrl+C to stop\n")
    
    files = get_all_files(SOURCE_DIR, EXTENSIONS)
    
    if not files:
        print("No files found to comment.")
        return
    
    print(f"Found {len(files)} files to potentially comment.\n")
    
    comment_count = 0
    
    try:
        while True:
            # Pick a random file
            target_file = random.choice(files)
            print(f"\n[{time.strftime('%H:%M:%S')}] Selected: {target_file}")
            
            # Insert a random comment
            if insert_random_comment(target_file):
                comment_count += 1
                print(f"Total comments added: {comment_count}")
            
            # Wait for random interval (1-2 minutes)
            wait_time = random.randint(RANDOM_COMMENT_MIN_INTERVAL, RANDOM_COMMENT_MAX_INTERVAL)
            print(f"Next comment in {wait_time} seconds...")
            time.sleep(wait_time)
            
    except KeyboardInterrupt:
        print(f"\n\nStopped. Total comments added: {comment_count}")

def main():
    print(f"Starting documentation generation for {SOURCE_DIR} using Google Gemini...")
    files = get_all_files(SOURCE_DIR, EXTENSIONS)
    
    if not files:
        print("No files found to document.")
        return

    total_files = len(files)
    total_seconds = DURATION_HOURS * 3600
    
    sleep_interval = total_seconds / total_files
    
    print(f"Found {total_files} files.")
    print(f"Model: {MODEL_NAME}")
    print(f"Target Duration: {DURATION_HOURS} hours")
    print(f"Sleep Interval: {sleep_interval:.2f} seconds between files")

    with open(TARGET_FILE, "a") as doc_file:
        doc_file.write(f"\n## Documentation Run (Gemini) - {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")

    for i, file_path in enumerate(files):
        print(f"Processing ({i+1}/{total_files}): {file_path}")
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            print(f"Skipping {file_path}: {e}")
            continue
            
        # Gemini 1.5 Flash has a huge context window (1M tokens), so truncation is rarely needed.
        # But we'll keep a sane limit just in case of rogue massive files.
        if len(content) > 500000:
            content = content[:500000] + "\n...(truncated)"
            
        comment = generate_comment(file_path, content)
        
        entry = f"\n### File: `{file_path}`\n\n{comment}\n\n---\n"
        
        with open(TARGET_FILE, "a") as doc_file:
            doc_file.write(entry)
            
        if i < total_files - 1:
            time.sleep(sleep_interval)

    print("Documentation generation complete.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--random-comments":
        run_random_commenter()
    else:
        # Default: run random commenter mode
        run_random_commenter()
