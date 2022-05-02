# PowerShell 配置

参考博客：[PowerShell 升级 & 增强](https://jalena.bcsytv.com/archives/2519)

## 安装

最新版本的 [PowerShell 发布地址](https://github.com/PowerShell/PowerShell/releases)

###　安装 PowerShellGet 包管理器

PowerShellGet 模块包含用于发现、安装、更新和发布包含来自 PowerShell gallery 和其他专用存储库的模块、DSC 资源、角色功能和脚本等项目的 PowerShell 包的 cmdlet。

```powershell
# 测试是否存在
Get-Module -ListAvailable PowerShellGet

# 安装
Install-Module -Name PowerShellGet -Force

# 升级
Update-Module -Name PowerShellGet
```

### PSReadLine & oh-my-posh & posh-git

- [powerline-setup](https://docs.microsoft.com/en-us/windows/terminal/tutorials/powerline-setup)
- [powerline](https://docs.microsoft.com/en-us/powershell/module/psreadline/?view=powershell-7.1)

```powershell
# 更改组策略权限
Get-ExecutionPolicy -List

# 确保当前用户为 RemoteSigned
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# PSReadLine
Install-Module -Name PSReadLine -Force

# posh-git
Install-Module posh-git -Scope CurrentUser

# DirColors
Install-Module DirColors -Scope CurrentUser

# oh-my-posh
# Install-Module oh-my-posh -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser -RequiredVersion 2.0.496
```


使用 `-Verbose` 参数来显示详细的下载信息，同时也可以使用 Proxy 来加速下载。

`$PSDefaultParameterValues` 首选项变量使你能够为任何 cmdlet 或高级函数指定自定义默认值。

```powershell
# 搜索支持代理的 cmdlet
Get-Command -ParameterName Proxy
# 设置代理
$Proxy = 'http://localhost:7890'
$PSDefaultParameterValues = @{
     'Install-Module:Proxy' = $Proxy
     'Update-Module:Proxy' = $Proxy
}

# 如果您已经在使用，$PSDefaultParameterValues 请将新条目添加到哈希中
$Proxy = 'http://localhost:7890'
$PSDefaultParameterValues.Add('Invoke-WebRequest:Proxy', $Proxy)
$PSDefaultParameterValues.Add('Invoke-RestMethod:Proxy', $Proxy)

# 全部设置为代理
$PSDefaultParameterValues = @{ "*:Proxy"="http://localhost:7890" }
```

## 配置

### 字体

默认的字体会引起部分字体不支持的情况，建议使用 https://www.nerdfonts.com 字体。其中 FiraCode Nerd Font、DejaVuSansMono Nerd Font、Cousine Nerd Font 支持的最好。

### 编辑配置文件

```powershell
if (!(Test-Path -Path $PROFILE )) { New-Item -Type File -Path $PROFILE -Force }

code $Profile
```

```powershell
<#
 * FileName: Microsoft.PowerShell_profile.ps1
 * Author: myp
 * Date: 2021-08-20
 * Copyright: No copyright. You can use this code for anything with no warranty.
#>


#-------------------------------   Import Modules   -------------------------------

# 引入 posh-git
Import-Module posh-git

# 引入 oh-my-posh
Import-Module oh-my-posh

# 设置 PowerShell 主题
# Set-PoshPrompt -Theme pure
Set-Theme Honukai

#
Import-Module Get-ChildItemColor

#-------------------------------   Set PSReadLine   -------------------------------

$PSReadLineOptions = @{
    # 设置预测文本来源为历史记录
    PredictionSource    = "History"
    HistoryNoDuplicates = $true
    # Colors                        = @{
    #     Command            = [ConsoleColor]::DarkGray
    #     Number             = [ConsoleColor]::DarkGreen
    #     Member             = [ConsoleColor]::DarkMagenta
    #     Operator           = [ConsoleColor]::DarkGray
    #     Type               = [ConsoleColor]::DarkRed
    #     Variable           = [ConsoleColor]::DarkYellow
    #     Parameter          = [ConsoleColor]::DarkGreen
    #     ContinuationPrompt = [ConsoleColor]::DarkGray
    #     Default            = [ConsoleColor]::DarkGray
    #     Emphasis           = [ConsoleColor]::DarkGray
    #     Error              = [ConsoleColor]::DarkRed
    #     Selection          = [ConsoleColor]::DarkGray
    #     Comment            = [ConsoleColor]::DarkCyan
    #     Keyword            = [ConsoleColor]::DarkRed
    #     String             = [ConsoleColor]::DarkGray
    # }
}
Set-PSReadLineOption @PSReadLineOptions

# 设置 Tab 键补全
# Set-PSReadlineKeyHandler -Key Tab -Function Complete

# 设置 Tab 为菜单补全
Set-PSReadLineKeyHandler -Key "Tab" -Function MenuComplete

# 设置 Ctrl+d 为退出 PowerShell
Set-PSReadlineKeyHandler -Key "Ctrl+d" -Function ViExit

# 设置 Ctrl+z 为撤销
Set-PSReadLineKeyHandler -Key "Ctrl+z" -Function Undo

# 设置向上键为后向搜索历史记录
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward

# 设置向下键为前向搜索历史纪录
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# 解析出现错误时，将部分提示符更改为红色
# Set-PSReadLineOption -PromptText "# "

#-------------------------------   Functions   -------------------------------

# 自定义提示
# function prompt {
#     Write-Host -NoNewLine -ForegroundColor Yellow "$pwd";
#     return "`n# "
# }

# Python 直接执行
$env:PATHEXT += ";.py"

#-------------------------------   Set Alias   -------------------------------

# 获取管理员权限
function Get-Elevated ($scriptblock) {
    # TODO: make -NoExit a parameter
    # TODO: just open PS (no -Command parameter) if $scriptblock -eq ''
    $sh = new-object -com 'Shell.Application'
    $sh.ShellExecute('pwsh', "-NoExit -NoProfile -Command $scriptblock", '', 'runAs')
}
# 设置Get-Elevated的别名为sudo
Set-Alias -Name sudo -Value Get-Elevated
```

### 其他

若需要自定义 PSReadLineOption 的 Color，可以使用如下命令来获取系统已有的颜色变量。

```powershell
[Enum]::GetValues([System.ConsoleColor])|ForEach-Object {Write-Host $_ -ForegroundColor $_}
```

同时也可以使用 [ConsoleColor]:: 加 Tab 来获取支持的枚举值。


## PowerShell 管理员权限

- [gsudo](https://github.com/gerardog/gsudo)
- [windows terminal 使用管理员权限打开](https://blog.csdn.net/qq_30262407/article/details/114921714)
- [启动 powershell.exe 时出现错误 0x80070002](https://blog.csdn.net/H244855/article/details/106331635)

### 安装

```powershell
PowerShell -Command "Set-ExecutionPolicy RemoteSigned -scope Process; iwr -useb https://raw.githubusercontent.com/gerardog/gsudo/master/installgsudo.ps1 | iex"
```

```json
// windows terminal settings.json
{
    "guid": "{eb1ae015-a893-46fa-b617-aa1dd07f64ae}",
    "hidden": true,
    "name": "PowerShell Elevated",
    "commandline": "gsudo.exe pwsh",
    "icon": "C:/software/\u56fe\u6807/gsudo.png"
},
{
    "guid": "{379d13bd-b38b-4d37-896f-1c60b0f0fe4d}",
    "name": "Terminal Elevated",
    "commandline": "powershell.exe -command Start-Process -Verb RunAs \"shell:appsFolder\\Microsoft.WindowsTerminal_8wekyb3d8bbwe!App\"",
    "icon": "ms-appx:///Images/Square44x44Logo.targetsize-32.png"
},
```

### 报错及解决方法

0x80070002：将 `C:\Windows\System32\WindowsPowerShell\v1.0` 添加到 PATH 中。
