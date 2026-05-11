import os
import shutil
import re

base_path = "/Users/dikshantjangra/Documents/projects/resolve-home/apps/admin/src/app"

def clean_dir_names(path):
    for item in os.listdir(path):
        full_path = os.path.join(path, item)
        if os.path.isdir(full_path):
            # Keep only alphanumeric, (), [], _, -
            new_item = re.sub(r'[^a-zA-Z0-9\(\)\[\]_\-]', '', item)
            if new_item != item:
                new_path = os.path.join(path, new_item)
                print(f"Fixing {full_path} -> {new_path}")
                if os.path.exists(new_path):
                    # Merge contents
                    for sub_item in os.listdir(full_path):
                        shutil.move(os.path.join(full_path, sub_item), os.path.join(new_path, sub_item))
                    os.rmdir(full_path)
                else:
                    os.rename(full_path, new_path)
                # Recurse into the NEW path
                clean_dir_names(new_path)
            else:
                # Recurse into the existing path
                clean_dir_names(full_path)

clean_dir_names(base_path)
