import sys
import argparse
from docling.document_converter import DocumentConverter
from pathlib import Path

def change_extension(file_name: str, new_extension: str) -> str:
    if not new_extension.startswith('.'):
        new_extension = f".{new_extension}"
    path = Path(file_name)
    return str(path.with_suffix(new_extension))

# Process the local file
def process_file(file_path, output_file, format='markdown'):
    """
    Process the uploaded file and extract text content.
    """
    convert(file_path, output_file, format)

# Process the remote URL
def process_url(url, output_file, format='markdown'):
    """
    Process the remote URL and extract text content. Throws an error 
    if the URL is invalid or cannot be fetched.
    """
    convert(url, output_file, format)

def convert(source, output_file, format='markdown'):
    converter = DocumentConverter()
    doc = converter.convert(source).document
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(doc.export_to_markdown())

# Main entry point for the script    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process a file or URL.")
    parser.add_argument('--file', type=str, help='Path to the file to process.')
    parser.add_argument('--url', type=str, help='URL to process.')
    parser.add_argument('--to', type=str, help='Output file path.')

    args = parser.parse_args()

    if args.file and args.url:
        print("Please provide either a file path or a URL, not both.")
        sys.exit(1)
    elif args.file:
        try:
            process_file(args.file, change_extension(args.to, '.md'))
            print(f"Successfully processed file: {args.file}")
        except Exception as e:
            print(f"Error processing file: {e}", file=sys.stderr)
            sys.exit(1)
    elif args.url:
        try:
            process_url(args.url, change_extension(args.to, '.md'))
            print(f"Successfully processed URL: {args.url}")
        except Exception as e:
            print(f"Error processing URL: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("Please provide either a file path or a URL to process.")
        sys.exit(1)