import winPackage
import os.path

avg=winPackage.package(Path="c:\\temp")
avg.build(Data={
				"name":"AVG (64bit edition)",
				"installer":"avg_free_x64_all_2011_1204a3402.exe",
				"params":["/UILevel=Minimal","/InstallToolbar=0","/InstallSidebar=1","/ParticipateProductImprovement=0","/DontRestart","/KillProcessesIfNeeded"]
				})