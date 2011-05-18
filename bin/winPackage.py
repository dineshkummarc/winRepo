import os
import os.path
from xml.dom import minidom
from xml import dom
import stat
import shutil

class package:
	def __init__(self,Path="."):
		self.path=Path
		
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
	
	def buildMetadata(self,Data={}):
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
		
		# print(winpackage_metadata.toxml(encoding="utf-8"))
		return winpackage_metadata.toxml(encoding="utf-8")
	
	def build(self,Data={}):
		# self.path=Path
		md = self.buildMetadata(Data)
		# print("creating package... TODO",Data)
		filename = os.path.basename(Data["path"]).rpartition(".")[0]
		os.makedirs(os.path.join(self.path,filename),exist_ok=True)
		fileMD = open(os.path.join(self.path,filename,filename+".winpackage"),mode="wb")
		fileMD.write(md)
		fileMD.close()
		shutil.copy(Data["path"],os.path.join(self.path,filename))
		
		
		
		
		