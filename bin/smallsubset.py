import platform
import os.path
import tkinter
import tkinter.ttk

import winRepo

def GUI(repo=None):
	
	def beginInstall():
		packagesSelection=[]
		for packselected in packagesSelectionSV:
			if packselected.get() is not "":
				packagesSelection.append(packselected.get())
		
		repo.installPackages(packagesSelection)
	
	def exitProg():
		installerWindow.destroy()
	
	installerWindow = tkinter.Tk()
	installerWindow.title("Instalador de programas")
	installerWindow_mainframe = tkinter.ttk.Frame(installerWindow, padding="3 3 12 12")
	installerWindow_mainframe.grid(column=0, row=0, sticky=(tkinter.N, tkinter.W, tkinter.E, tkinter.S))
	installerWindow_mainframe.columnconfigure(0, weight=1)
	installerWindow_mainframe.rowconfigure(0, weight=1)
	
	arch = platform.architecture()
	tkinter.ttk.Label(installerWindow_mainframe, text="Programas disponibles ("+arch[1]+" "+arch[0]+")").grid(column=1, row=1, sticky=(tkinter.W, tkinter.E))
	
	programsList = tkinter.ttk.Frame(installerWindow_mainframe, padding="3 3 12 12")
	programsList.grid(column=1, row=2, sticky=(tkinter.N, tkinter.W))
	programsList.columnconfigure(1, weight=1)
	programsList.rowconfigure(2, weight=1)
	
	row=0
	packagesSelectionSV=list()
	for package in repo.packages:
		package.load()
		packagesSelectionSV.append(tkinter.StringVar())
		element = tkinter.ttk.Checkbutton(programsList, text=package.name, variable=packagesSelectionSV[len(packagesSelectionSV)-1], onvalue=package.name, offvalue="")
		element.grid(column=1, row=row, sticky=(tkinter.N, tkinter.W))
		# element.state(package.name)
		row+=1
	
	okButton = tkinter.ttk.Button(installerWindow_mainframe, text='Instalar', command=beginInstall, default="active")
	okButton.grid(column=1, row=3, sticky=(tkinter.S, tkinter.W))
	cancelButton = tkinter.ttk.Button(installerWindow_mainframe, text='Salir', command=exitProg)
	cancelButton.grid(column=1, row=4, sticky=(tkinter.S, tkinter.W))
	
	# tkinter.ttk.Sizegrip(installerWindow).grid(column=999, row=999, sticky=(tkinter.S,tkinter.E))
	installerWindow.bind('<Return>', lambda e: okButton.invoke())
	installerWindow.mainloop()
	
repo = winRepo.repository(basePath=os.path.join("..","repo"))
# repo = winRepo.repository()
repo.loadData(dataFile="repodata.xml")

GUI(repo)
