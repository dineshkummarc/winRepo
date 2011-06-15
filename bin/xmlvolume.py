import os
import os.path
import stat
import shutil
from xml import dom

debug=False

class xmlLeaf:
	def __init__(self,Name,Origin):
		self.Name=Name
		self.Origin=Origin

class Directory(xmlLeaf):
	def __init__(self,Name,Origin):
		self.Name=Name
		self.Origin=Origin
		self.Trunk=[]

	def addChild(self,childLeaf):
		self.Trunk.append(childLeaf)
	
	def binarySync(self,destinationParent):
		pass
	
	def asTreeLeaf(self,document,flat=True):
		self.Element = document.createElement('directory')
		self.Element.setAttribute("name",self.Name)
		if debug:
			self.Element.setAttribute("origin",self.Origin)
		for leaf in self.Trunk:
			self.Element.appendChild(leaf.asTreeLeaf(document,flat))
		return self.Element
		
class File(xmlLeaf):
	
	def binarySync(self,destinationParent):
		shutil.copy(self.Origin,destinationParent)
	
	def asTreeLeaf(self,document,flat=True):
		self.Element = document.createElement('file')
		self.Element.setAttribute("name",self.Name)
		if debug:
			self.Element.setAttribute("origin",self.Origin)
		return self.Element

class xmlvolume:		
	
	def __init__(self,BasePath=".",Name=None,Version=None,Extension=".XMLVolume",Populate=None):
		
		self.SourceMatrix = dom.getDOMImplementation()
		self.Document = self.SourceMatrix.createDocument(None,"volume",None)
		
		if Name:
			self.Name = Name
		else:
			self.Name = "Unnamed"
		self.Document.documentElement.setAttribute("name",self.Name)
		if Version:
			self.Version = Version
		else:
			self.Version = "Unknown"
		self.Document.documentElement.setAttribute("version",self.Version)
		
		self.BasePath = BasePath
		self.Extension = Extension
		self.Trunk=None
		
		if Populate:
			self.addToTree(Populate)
	
	def addToTree(self,SourcePath):
		
		def buildLeaf(path, parent):
			for leaf in os.listdir(path):
				pathname = os.path.join(path, leaf)
				mode = os.stat(pathname)[stat.ST_MODE]
				if stat.S_ISDIR(mode):
					# It's a directory, recurse into it
					thisLeaf = Directory(Name=leaf,Origin=pathname)
					buildLeaf(pathname, thisLeaf)
				elif stat.S_ISREG(mode):
					# It's a file, call the callback function
					thisLeaf = File(Name=leaf,Origin=pathname)
				else:
					# Unknown file type, print a message
					print('Skipping %s' % pathname)
				parent.addChild(thisLeaf)
		
		leafname = os.path.basename(SourcePath)
		mode = os.stat(SourcePath)[stat.ST_MODE]
		if stat.S_ISDIR(mode):
			self.Trunk = Directory(Name=leafname,Origin=SourcePath)
			buildLeaf(SourcePath, self.Trunk)
		elif stat.S_ISREG(mode):
			# It's a file, call the callback function
			self.Trunk = File(Name=leafname,Origin=SourcePath)
		else:
			# Unknown file type, print a message
			print('Skipping %s' % pathname)
	
	def dump(self,flat=True):
		os.makedirs(os.path.join(self.BasePath,self.Name),exist_ok=True)
		if not flat:
			self.Trunk.binarySync(os.path.join(self.BasePath,self.Name))
		self.Document.documentElement.appendChild(self.Trunk.asTreeLeaf(self.Document,flat))
		os.makedirs(os.path.join(self.BasePath,self.Name),exist_ok=True)
		fileMD = open(os.path.join(self.BasePath,self.Name,self.Name+self.Extension),mode="wb")
		fileMD.write(self.Document.toxml(encoding="utf-8"))
		fileMD.close()
		