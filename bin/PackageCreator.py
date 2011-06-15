import tkinter
import tkinter.ttk
import tkinter.filedialog
import os.path

import winPackage

def GUI():

	def fileSelected():
		filename = tkinter.filedialog.askopenfilename()
		if filename is not "":
			source_description.set("file name:")
			source_path.set(os.path.basename(filename))
			long_name.set(os.path.basename(filename).rpartition(".")[0])
			packageData['path'] = filename

	def folderSelected():
		dirname = tkinter.filedialog.askdirectory()
		if dirname is not "":
			source_description.set("directory name:")
			source_path.set(os.path.basename(dirname))
			packageData['path'] = dirname

	def createPackage():
		package = winPackage.package(Name=long_name.get(),DestinationPath=os.path.join("..","repo"),SourcePath=packageData['path'])
		package.build()
		
		# packageData["name"] = long_name.get()
		# packageData["params"] = params.get()
		# package.build_legacy(packageData)

	def exitProg():
		managerWindow.destroy()

	packageData={}
		
	managerWindow = tkinter.Tk()
	managerWindow.title("winRepo Package Builder")

	managerWindow_mainframe = tkinter.ttk.Frame(managerWindow, padding="3 3 12 12")
	managerWindow_mainframe.grid(column=0, row=0, sticky=(tkinter.N, tkinter.W, tkinter.E, tkinter.S))
	managerWindow_mainframe.columnconfigure(0, weight=1)
	managerWindow_mainframe.rowconfigure(0, weight=1)

	fileButton = tkinter.ttk.Button(managerWindow_mainframe, text='Select File', command=fileSelected)
	fileButton.grid(column=1, row=1, sticky=(tkinter.S, tkinter.W))
	
	folderButton = tkinter.ttk.Button(managerWindow_mainframe, text='Select Folder', command=folderSelected)
	folderButton.grid(column=2, row=1, sticky=(tkinter.S, tkinter.W))
	
	source_description = tkinter.StringVar()
	source_description.set("select source")
	tkinter.ttk.Label(managerWindow_mainframe, textvariable=source_description).grid(column=1, row=2, sticky=(tkinter.W, tkinter.E))
	source_path = tkinter.StringVar()
	tkinter.ttk.Label(managerWindow_mainframe, textvariable=source_path).grid(column=2, row=2, sticky=(tkinter.W, tkinter.E))
	
	tkinter.ttk.Label(managerWindow_mainframe, text="Name").grid(column=1, row=3, sticky=(tkinter.W, tkinter.E))
	long_name = tkinter.StringVar()
	long_name_entry = tkinter.ttk.Entry(managerWindow_mainframe, width=25, textvariable=long_name)
	long_name_entry.grid(column=2, row=3, sticky=(tkinter.S, tkinter.W))
	
	tkinter.ttk.Label(managerWindow_mainframe, text="Parameters").grid(column=1, row=4, sticky=(tkinter.W, tkinter.E))
	params = tkinter.StringVar()
	params_entry = tkinter.ttk.Entry(managerWindow_mainframe, width=25, textvariable=params)
	params_entry.grid(column=2, row=4, sticky=(tkinter.S, tkinter.W))
	
	okButton = tkinter.ttk.Button(managerWindow_mainframe, text='Create', command=createPackage, default="active")
	okButton.grid(column=1, row=5, sticky=(tkinter.S, tkinter.W))
	cancelButton = tkinter.ttk.Button(managerWindow_mainframe, text='Exit', command=exitProg)
	cancelButton.grid(column=2, row=5, sticky=(tkinter.S, tkinter.W))
	
	managerWindow.bind('<Return>', lambda e: okButton.invoke())
	managerWindow.mainloop()
	
GUI()