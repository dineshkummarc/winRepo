import os.path
from xml.dom import minidom

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
		pass
	
	def build(self,Data={}):
		# self.path=Path
		pass
		
		