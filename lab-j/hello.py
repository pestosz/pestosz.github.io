import sys
ver = ".".join(map(str, sys.version_info[0:3]))
path = sys.executable
txt = f"Hello Bartosz (57885). This environment is using Python version {ver} at location:\n{path}"
print(txt)