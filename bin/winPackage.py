import os
import os.path
from xml.dom import minidom
from xml import dom
import stat
import shutil
import base64
import hashlib

import xmlvolume

class package:

	def __init__(self,Name="Unnamed",Version="Unknown",DestinationPath="../xmlfs",SourcePath="."):
		
		self.SourceMatrix = dom.getDOMImplementation()
		self.Document = self.SourceMatrix.createDocument(None,"winPackage",None)
		
		self.Name=Name
		self.NameElement = self.Document.createElement("name")
		self.NameElement.appendChild(self.Document.createTextNode(self.Name))
		self.Document.documentElement.appendChild(self.NameElement)
		
		self.Version=Version
		self.Document.documentElement.setAttribute("version",self.Version)
		
		self.DestinationPath=DestinationPath
		self.SourcePath=SourcePath
		
		self.FileTree=xmlvolume.xmlvolume(BasePath=self.DestinationPath,Name=Name,Version=Version,Extension=".winpackage",Populate=SourcePath)
		
	def load(self):
		data = minidom.parse(self.path)
		self.name = data.getElementsByTagName("name").item(0).getAttribute("es")
		installer = data.getElementsByTagName("installer").item(0)
		self.installer = os.path.join(os.path.dirname(self.path),installer.getAttribute("file"))
		self.installer_params = []
		inst_params = installer.getElementsByTagName("param")
		for i in range(inst_params.length):
			self.installer_params.append(inst_params.item(i).getAttribute("value"))
	
	def install(self):
		import subprocess
		if self.installer_params:
			installer_params=" "
			for i in self.installer_params:
				installer_params+=i
				installer_params+=" "
		# print(installer_params,end="\n")
		subprocess.call(self.installer+installer_params,shell=True)
	
	# def buildMetadata(self,Data={},flat=True):
		
	def define(self,Name="Unnamed",Version="Unknown",FileTree=None):
		pass
	
	def build_legacy(self,Data={},flat=True):
		# self.path=Path
		
		def xmlizeFile():
			fileelement = winpackage_metadata.createElement("file")
			fileelement.setAttribute("filename",os.path.basename(Data["path"]))
			winpackage_metadata.documentElement.appendChild(fileelement)
			
			fl = open(Data["path"],"rb")
			flrd = fl.read()
			
			fileelement.setAttribute("md5_hash",hashlib.md5(flrd).hexdigest())

			flrd64 = base64.encodebytes(flrd)
			flrd64str = flrd64.decode(encoding="utf-8")
			# print(flrd64str)
			flrda = winpackage_metadata.createCDATASection(flrd64str)
			fileelement.appendChild(flrda)
		
		# Building package metadata
		sourceMatrix = dom.getDOMImplementation()
		winpackage_metadata = sourceMatrix.createDocument(None,"winPackage",None)
		name = winpackage_metadata.createElement("name")
		name.setAttribute("es",Data["name"])
		winpackage_metadata.documentElement.appendChild(name)
		installer = winpackage_metadata.createElement("installer")
		installer.setAttribute("file",os.path.basename(Data["path"]))
		winpackage_metadata.documentElement.appendChild(installer)
		params = Data["params"].split(" ")
		for param in params:
			prm = winpackage_metadata.createElement("param")
			prm.setAttribute("value",param)
			installer.appendChild(prm)
		
		# Append file in metadata if flat
		if flat:
			xmlizeFile()
		
		# Actually writing the winpackage file
		filename = os.path.basename(Data["path"]).rpartition(".")[0]
		os.makedirs(os.path.join(self.path,filename),exist_ok=True)
		fileMD = open(os.path.join(self.path,filename,filename+".winpackage"),mode="wb")
		fileMD.write(winpackage_metadata.toxml(encoding="utf-8"))
		fileMD.close()
		if not flat:
			shutil.copy(Data["path"],os.path.join(self.path,filename))
		
	def build(self,flat=True):
		# self.Document.documentElement.appendChild(self.FileTree.dumpTree(self.Document))
		self.FileTree.dump(flat=False)
		# filename = os.path.basename(self.SourcePath).rpartition(".")[0]
		# os.makedirs(os.path.join(self.DestinationPath,filename),exist_ok=True)
		# fileMD = open(os.path.join(self.DestinationPath,filename,filename+".winpackage"),mode="wb")
		# fileMD.write(self.Document.toxml(encoding="utf-8"))
		# fileMD.close()
		
		
		