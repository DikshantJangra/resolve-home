import os
import shutil

base_path = "/Users/dikshantjangra/Documents/projects/resolve-home/apps/admin/src/app"

for item in os.listdir(base_path):
    full_path = os.path.join(base_path, item)
    if os.path.isdir(full_path):
        # Clean the name: remove trailing slashes or other weird characters
        clean_name = item.replace("/", "").replace("\\", "").strip()
        if clean_name != item:
            new_path = os.path.join(base_path, clean_name)
            print(f"Renaming {full_path} to {new_path}")
            if os.path.exists(new_path):
                # Merge contents
                for root, dirs, files in os.walk(full_path):
                    for file in files:
                        src_file = os.path.join(root, file)
                        rel_path = os.path.relpath(src_file, full_path)
                        dst_file = os.path.join(new_path, rel_path)
                        os.makedirs(os.path.dirname(dst_file), exist_ok=True)
                        shutil.copy2(src_file, dst_file)
                shutil.rmtree(full_path)
            else:
                os.rename(full_path, new_path)

# Special check for internal broken names like [id/]
for root, dirs, files in os.walk(base_path):
    for d in dirs:
        if "/" in d or "\\" in d:
            clean_d = d.replace("/", "").replace("\\", "").strip()
            src = os.path.join(root, d)
            dst = os.path.join(root, clean_d)
            print(f"Fixing inner dir {src} to {dst}")
            if os.path.exists(dst):
                # Move files and delete
                for f in os.listdir(src):
                    shutil.move(os.path.join(src, f), os.path.join(dst, f))
                os.rmdir(src)
            else:
                os.rename(src, dst)
