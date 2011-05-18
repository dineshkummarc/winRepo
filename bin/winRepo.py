import os.path
from xml.dom import minidom

import winPackage

class repository:
	
	def __init__(self,basePath="c:\repo"):
		self.basePath = basePath
		self.packages=[]
	
	def loadData(self,dataFile="repodata.index"):
		repodata_xml = os.path.join(self.basePath,dataFile)
		repodata = minidom.parse(repodata_xml)
		# print(repodata.toxml(encoding="utf-8"),end="\n")
		packages=repodata.getElementsByTagName("package")

		for i in range(packages.length):
			self.packages.append(winPackage.package(os.path.join(self.basePath,packages.item(i).getAttribute("path"),packages.item(i).getAttribute("path")+".winpackage")))
			# print("Instalando",packages.item(i).getAttribute("name"),sep=" ",end="\n")
			# pckgs[packages.item(i).getAttribute("name")].install()

	def installPackages(self,packagesList=None):
		for package in self.packages:
			if package.name in packagesList:
				package.install()
