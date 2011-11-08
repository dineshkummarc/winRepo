import os
import os.path
import stat
import shutil
from xml import dom

debug=False

class Tree:		
	
	def __init__(self,BasePath=".",Name="Unnamed",Version="Unknown",Type="XMLVolume",Mode='database'):
		
		self.SourceMatrix = dom.getDOMImplementation()
		self.DocType = self.SourceMatrix.createDocumentType('volume','http://localhost/xmlvolume.dtd','xmlvolume.dtd')
		self.Document = self.SourceMatrix.createDocument("xmlvolume.dtd/volume","volume",self.DocType)
		
		self.Name = Name
		self.Document.documentElement.setAttribute("name",self.Name)
		
		self.Version = Version
		self.Document.documentElement.setAttribute("version",self.Version)
		
		self.BasePath = BasePath
		self.Type = Type
		self.Mode = Mode
		self.Trunk=None
	
	def some(self):
		print('ok')
	
	def addLeaf(self,leafID,parent=None):
		leaf=self.Document.createElement('leaf')
		leaf.setAttribute('id',leafID)
		if not parent:
			self.Document.documentElement.appendChild(leaf)
	
	def addBranch(self,branchID,parent=None):
		branch=self.Document.createElement('branch')
		branch.setAttribute('id',branchID)
		if not parent:
			self.Document.documentElement.appendChild(branch)
		else:
			parentElement=self.Document.getElementById(parent)
			parentElement.appendChild(branch)
			
	def dump(self,flat=True):
		os.makedirs(os.path.join(self.BasePath,self.Name),exist_ok=True)
		if not flat:
			self.Trunk.binarySync(os.path.join(self.BasePath,self.Name))
		self.Document.documentElement.appendChild(self.Trunk.asTreeLeaf(self.Document,flat))
		os.makedirs(os.path.join(self.BasePath,self.Name),exist_ok=True)
		fileMD = open(os.path.join(self.BasePath,self.Name,self.Name+"."+self.Type),mode="wb")
		fileMD.write(self.Document.toxml(encoding="utf-8"))
		fileMD.close()

test = Tree()
test.addBranch(branchID='test')
test.addLeaf(leafID='testing',parent='test')
print(test.Document.toxml(encoding="utf-8"))