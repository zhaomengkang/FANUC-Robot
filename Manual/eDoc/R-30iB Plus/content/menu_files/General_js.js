//<SCRIPT LANGUAGE="JAVASCRIPT">
// Definition of class Folder 
// ***************************************************************** 
 
function Folder(folderDescription, hreference) //constructor

{ 
  //constant data 
  this.desc = folderDescription
  this.hreference = hreference 
  this.id = -1   
  this.navObj = 0  
  this.iconImg = 0  
  this.nodeImg = 0  
  this.isLastNode = 0 
 
  //dynamic data 
  this.isOpen = true 
  this.iconSrc = "images/OpenFolder.jpg"   
  this.children = new Array 
  this.nChildren = 0
 
  //methods 
  this.initialize = initializeFolder 
  this.setState = setStateFolder 
  this.addChild = addChild 
  this.createIndex = createEntryIndex 
  this.hide = hideFolder 
  this.display = display 
  this.renderOb = drawFolder 
  this.totalHeight = totalHeight 
  this.subEntries = folderSubEntries 
  this.outputLink = outputFolderLink 
} 
 
function setStateFolder(isOpen) 
{ 
  var subEntries 
  var totalHeight 
  var fIt = 0 
  var i=0 
 
  if (isOpen == this.isOpen) 
    return 
  if (browserVersion == 2)  
  { 
    totalHeight = 0 
    for (i=0; i < this.nChildren; i++) 
      totalHeight = totalHeight + this.children[i].navObj.clip.height 
      subEntries = this.subEntries() 
    if (this.isOpen) 
      totalHeight = 0 - totalHeight 
    for (fIt = this.id + subEntries + 1; fIt < nEntries; fIt++) 
      indexOfEntries[fIt].navObj.moveBy(0, totalHeight) 
  }  
  this.isOpen = isOpen 
  propagateChangesInState(this) 
} 
 
function propagateChangesInState(folder) 
{   
  var i=0 
 
  if (folder.isOpen) 
  { 
    if (folder.nodeImg) 
      if (folder.isLastNode) 
        folder.nodeImg.src = "images/mlastnode.gif" 
               
      else 
	  folder.nodeImg.src = "images/mnode.gif" 
    folder.iconImg.src = "images/folderopen.gif "
    for (i=0; i<folder.nChildren; i++) 
      folder.children[i].display() 
  } 
  else 
  { 
    if (folder.nodeImg) 
      if (folder.isLastNode) 
        folder.nodeImg.src = "images/plastnode.gif" 
      else 
	  folder.nodeImg.src = "images/pnode.gif" 
    folder.iconImg.src = "images/closedfolder.jpg" 
    for (i=0; i<folder.nChildren; i++) 
      folder.children[i].hide() 
  }  
} 
 
function hideFolder() 
{ 
  if (browserVersion == 1) 
  { 
    if (this.navObj.style.display == "none") 
      return 
    this.navObj.style.display = "none" 
  } 
  else 
  { 
    if (this.navObj.visibility == "hidden") 
      return 
    this.navObj.visibility = "hidden" 
  } 
   
  this.setState(0) 
} 

function initializeFolder(level, lastNode, leftSide) 
{ 
  var j=0 
  var i=0 
  var numberOfFolders 
  var numberOfDocs 
  var nc 
        
  nc = this.nChildren 
   
  this.createIndex() 
 
  var auxEv = "" 
 
  if (browserVersion > 0) 
    auxEv = "<a href='javascript:clickOnNode("+this.id+")'>" 
  else 
    auxEv = "<a>" 
 
  if (level>0) 
    if (lastNode) //the last 'brother' in the children array 
    { 
      this.renderOb(leftSide + auxEv + "<img name='nodeIcon" + this.id + "' src='images/mlastnode.gif' width=16 height=22 border=0></a>") 
      leftSide = leftSide + "<img src='images/blank.gif' width=16 height=22>"  
      this.isLastNode = 1 
    } 
    else 
    { 
      this.renderOb(leftSide + auxEv + "<img name='nodeIcon" + this.id + "' src='images/mnode.gif' width=16 height=22 border=0></a>") 
      leftSide = leftSide + "<img src='images/vertline.gif' width=16 height=22>" 
      this.isLastNode = 0 
    } 
  else 
    this.renderOb("") 
   
  if (nc > 0) 
  { 
    level = level + 1 
    for (i=0 ; i < this.nChildren; i++)  
    { 
      if (i == this.nChildren-1) 
        this.children[i].initialize(level, 1, leftSide) 
      else 
        this.children[i].initialize(level, 0, leftSide) 
    } 
  } 
} 
 
function drawFolder(leftSide) 
{ 
  if (browserVersion == 2) 
  { 
    if (!doc.yPos) 
      doc.yPos=158
      doc.xPos=30
    doc.write("<layer id='folder" + this.id + "' top=" + doc.yPos +  " left=" + doc.xPos + " visibility=hidden>") 
  } 
   
  doc.write("<table ") 
  if (browserVersion == 1) 
    doc.write(" id='folder" + this.id + "' style='position:block;' ") 
  doc.write(" border=0 cellspacing=0 cellpadding=0>") 
  doc.write("<tr><td>") 
  doc.write(leftSide) 
  this.outputLink() 
  doc.write("<img name='folderIcon" + this.id + "' ") 
  doc.write("src='" + this.iconSrc+"' border=0></a>") 
  doc.write("</td><td valign=middle nowrap>") 
  if (USETEXTLINKS)   
  { 
    this.outputLink() 
    doc.write('<Font size=-2>')
    doc.write(this.desc + "</FONT></a>") 
    
    //doc.write("<input name='txtDesc"+this.id+"' >")
  } 
  else 
  {
    doc.write('<Font size=-2>')
    doc.write(this.desc)
    doc.write('</Font>')
  }
  
  doc.write("</td>")  
  doc.write("</tr>")
  doc.write("</table>") 
   
  if (browserVersion == 2) 
  { 
    doc.write("</layer>") 
  } 
 
  if (browserVersion == 1) 
  { 
    this.navObj = doc.all["folder"+this.id] 
    this.iconImg = doc.all["folderIcon"+this.id] 
    this.nodeImg = doc.all["nodeIcon"+this.id] 
  } 
  else if (browserVersion == 2) 
  { 
    this.navObj = doc.layers["folder"+this.id] 
    this.iconImg = this.navObj.document.images["folderIcon"+this.id] 
    this.nodeImg = this.navObj.document.images["nodeIcon"+this.id] 
    doc.yPos=doc.yPos+this.navObj.clip.height 
  } 
} 
 
function outputFolderLink() 
{ 
  if (this.hreference) 
  { 
    doc.write("<a href='" + this.hreference + "' TARGET=\"basefrm\" ") 
    if (browserVersion > 0) 
      doc.write("onClick='javascript:clickOnFolder("+this.id+")'") 
    doc.write(">") 
  } 
  else 
  {
//  doc.write("<a>") 
    doc.write("<a href='javascript:clickOnNode("+this.id+")'>")
  }
} 


function addChild(childNode) 
{ 
  this.children[this.nChildren] = childNode 
  this.nChildren++ 
  return childNode 
} 
 
function folderSubEntries() 
{ 
  var i = 0 
  var se = this.nChildren 
 
  for (i=0; i < this.nChildren; i++)
  { 
    if (this.children[i].children) //is a folder 
      se = se + this.children[i].subEntries() 
  } 
 
  return se 
} 
 
 
// Definition of class Item (a document or link inside a Folder) 
// ************************************************************* 
 
function Item(itemDescription, itemLink) // Constructor 
{ 
  // constant data 
  this.desc = itemDescription 
  this.link = itemLink 
  this.id = -1 //initialized in initalize() 
  this.navObj = 0 //initialized in render() 
  this.iconImg = 0 //initialized in render() 
  this.iconSrc = "images/doc.gif" 
 
  // methods 
  this.initialize = initializeItem 
  this.createIndex = createEntryIndex 
  this.hide = hideItem 
  this.display = display 
  this.renderOb = drawItem 
  this.totalHeight = totalHeight 

} 
 
function hideItem() 
{ 
  if (browserVersion == 1) 
  { 
    if (this.navObj.style.display == "none") 
      return 
    this.navObj.style.display = "none" 
  } 
  else 
  { 
    if (this.navObj.visibility == "hidden") 
      return 
    this.navObj.visibility = "hidden" 
  }     
} 
 
function initializeItem(level, lastNode, leftSide) 
{  
  this.createIndex() 
 
  if (level>0) 
    if (lastNode) //the last 'brother' in the children array 
    { 
      this.renderOb(leftSide + "<img src='images/lastnode.jpg' width=16 height=22>") 
      leftSide = leftSide + "<img src='images/blank.gif' width=16 height=22>"  
    } 
    else 
    { 
      this.renderOb(leftSide + "<img src='images/node.gif' width=16 height=22>") 
      leftSide = leftSide + "<img src='images/vertline.gif' width=16 height=22>" 
    } 
  else 
    this.renderOb("")   
} 
 
function drawItem(leftSide) 
{ 
  if (browserVersion == 2) 
  { 
    doc.xPosition=doc.xPos;
    doc.write("<layer id='item" + this.id + "' top=" + doc.yPos +" left=" + doc.xPosition + " visibility=hidden>") 
  }
  doc.write("<table ") 
  if (browserVersion == 1) 
    doc.write(" id='item" + this.id + "' style='position:block;' ") 
  doc.write(" border=0 cellspacing=0 cellpadding=0>") 
  doc.write("<tr><td>") 
  doc.write(leftSide)
   
  doc.write("<a href=" + this.link + ">") 
  doc.write("<img id='itemIcon"+this.id+"' ") 
  doc.write("src='"+this.iconSrc+"' border=0>") 
  doc.write("</a>") 
  doc.write("</td><td valign=middle nowrap>") 
  if (USETEXTLINKS)
    doc.write("<a href=" + this.link + "><Font size=-2>" + this.desc + "</Font></a>") 
  else 
  {
    doc.write('<Font size=-2>')
    doc.write(this.desc)
    doc.write('</Font>')
  }
  doc.write("</tr>")
  doc.write("</table>")

  if (browserVersion == 2)
    doc.write("</layer>")
 
  if (browserVersion == 1)
  {
    this.navObj = doc.all["item"+this.id]
    this.iconImg = doc.all["itemIcon"+this.id]
  }
  else if (browserVersion == 2)
  {
    this.navObj = doc.layers["item"+this.id]
    this.iconImg = this.navObj.document.images["itemIcon"+this.id] 
    doc.yPos=doc.yPos+this.navObj.clip.height 
  } 
} 
 
 
// Methods common to both objects (pseudo-inheritance) 
// ******************************************************** 
 
function display() 
{ 
    if (browserVersion == 1) 
      this.navObj.style.display = "block" 
    else 
      this.navObj.visibility = "show" 
} 
 
function createEntryIndex() 
{ 
  this.id = nEntries 
  indexOfEntries[nEntries] = this 
  nEntries++ 
} 
 
// total height of subEntries open 
function totalHeight() //used with browserVersion == 2 
{ 
  var h = this.navObj.clip.height 
  var i = 0 
   
  if (this.isOpen) //is a folder and _is_ open 
    for (i=0 ; i < this.nChildren; i++)  
      h = h + this.children[i].totalHeight() 
 
  return h 
} 
 
 
// Events 
// ********************************************************* 

function clickOnFolder(folderId) 
{ 
  var clicked = indexOfEntries[folderId] 
 
  if (!clicked.isOpen)
    clickOnNode(folderId) 
  return  
 
  if (clicked.isSelected) 
    return 
} 
 
function clickOnNode(folderId) 
{ 
  var clickedFolder = 0 
  var state = 0 
 
  clickedFolder = indexOfEntries[folderId] 
  state = clickedFolder.isOpen 
 
  clickedFolder.setState(!state) //open<->close  
} 

function clickModifyFolder(folderId,folderDesc) 
{
    
    var strUrl = ""        //URL for Window.Open
    var strFeatures = ""   //Features for Window.Open
   
    strUrl = "http://eparts.frc.com/AdminDocs/include/ModifyFolder.asp?folderID=" + folderId + "&folderDesc=" + folderDesc
    strFeatures = "toolbar=no, location=no, directories=no, "
        + "status=no, menubar=no, scrollbars=no, resizable=no, "
        + "width=425, height=150, top=100, left=200"

    //Open the calendar page
    window.open(strUrl, "ModifyFolderDescription", strFeatures)
}

function initializeDocument() 
{ 
  if (doc.all) 
    browserVersion = 1 //IE4   
  else 
    if (doc.layers) 
      browserVersion = 2 //NS4 
    else 
      browserVersion = 0 //other 
 
  TopLevel.initialize(0, 1, "") 
  TopLevel.display()
  
  if (browserVersion > 0) 
  { 
    doc.write("<layer top="+indexOfEntries[nEntries-1].navObj.top+">&nbsp;</layer>") 
 
    // close the whole tree 
    clickOnNode(0) 
    // open the root folder 
    clickOnNode(0) 
  } 
} 
 
// Auxiliary Functions for Folder-Treee backward compatibility 
// ********************************************************* 
 
function gFld(description, hreference)
{ 
  folder = new Folder(description, "")
  
  return folder 
} 
 
function gLnk(target, description, linkData) 
{ 
  fullLink = "" 
//  eDoclink = "/eDocs/" //location of the eDocsFolder
  eDoclink = "" 
  if (target==1) 
  { 
    fullLink = "'"+eDoclink+linkData+"' target=_blank" 
  } 
  else 
  { 
    if (target==0) 
       fullLink = "'"+linkData+"' target=\"basefrm\"" 
    else 
       fullLink = "'"+eDoclink+linkData+"' target=\"basefrm\"" 
  } 
 
  linkItem = new Item(description, fullLink)   
  return linkItem 
} 
 
function insertFolder(parentFolder, childFolder) 
{ 
  return parentFolder.addChild(childFolder) 
} 
 
function insertDoc(parentFolder, document) 
{ 
  parentFolder.addChild(document) 
} 
 
// Global variables 
// **************** 
 
USETEXTLINKS = 1
indexOfEntries = new Array 
nEntries = 0 
doc = document 
browserVersion = 0 
selectedFolder=0

//</SCRIPT>
