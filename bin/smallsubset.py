import os.path
from xml.dom import minidom

import winPackage

repo_base = os.path.join("..","repo")


repodata_xml = os.path.join(repo_base,"repodata.xml")
repodata = minidom.parse(repodata_xml)
# print(repodata.toxml(encoding="utf-8"),end="\n")
packages=repodata.getElementsByTagName("package")

pckgs={}
for i in range(packages.length):
	pckgs[packages.item(i).getAttribute("name")] = winPackage.package(os.path.join(repo_base,packages.item(i).getAttribute("path"),packages.item(i).getAttribute("path")+".winpackage"))
	print("Instalando",packages.item(i).getAttribute("name"),sep=" ",end="\n")
	pckgs[packages.item(i).getAttribute("name")].install()
