// Autocomplete script for Zoom Search Engine
// (c) Copyright 2015 Wrensoft

var ZoomAutoComplete_xmlHttp = null; 
var ZoomAutoComplete_Selected = 0;

// Keycode mapping
var ZOOM_AUTOCOMPLETE_TAB = 9;
var ZOOM_AUTOCOMPLETE_ENTER = 13;
var ZOOM_AUTOCOMPLETE_ESC = 27;
var ZOOM_AUTOCOMPLETE_KEYUP = 38;
var ZOOM_AUTOCOMPLETE_KEYDN = 40;

function ZoomAutoComplete_UseSuggestion(p_searchString) 
{
	if (p_searchString != '' && p_searchString != undefined)		
	{
		var elem = document.getElementById("zoom_searchbox");			
		elem.value = p_searchString;
		var acElem = document.getElementById("zoom_ac_dropdown");
		acElem.style.visibility = 'hidden';
		return (true);
	}	
	else
	{
		var dd = document.getElementById('zoom_ac_dropdown');	
		var items = dd.getElementsByTagName('a');	
		var icount = 0;
		for (i in items)
		{
			var li = items[i];	
			if (icount == ZoomAutoComplete_Selected)
			{
				if (li.innerHTML != undefined)
					ZoomAutoComplete_UseSuggestion(li.innerHTML);
				break;
			}
			icount++;
		}		
	}	
	return (false);
}		

function ZoomAutoComplete_GetKeyCode(ev)
{
	if (ev)	// mozilla
		return ev.keyCode;
	if (window.event) // IE
		return window.event.keyCode;
}

function ZoomAutoComplete_Hide()
{
	var acElem = document.getElementById('zoom_ac_dropdown');				
	acElem.style.visibility = 'hidden';	
}

function ZoomAutoComplete_Show()
{
	var acElem = document.getElementById('zoom_ac_dropdown');				
	acElem.style.visibility = '';	
}

function ZoomAutoComplete_GetLeft(element)
{
	var curNode = element;
    var left    = 0;
    do
    {
        left += curNode.offsetLeft;
        curNode = curNode.offsetParent;
    } while(curNode.tagName.toLowerCase() != 'body' && curNode.style.position != 'fixed');
    return left;
}
    
function ZoomAutoComplete_GetTop(element)
{
    var curNode = element;
    var top = 0;
    do 
    {
        top += curNode.offsetTop;
        curNode = curNode.offsetParent;
    } while(curNode.tagName.toLowerCase() != 'body' && curNode.style.position != 'fixed');	
    return top;
}



function ZoomAutoComplete_ChangeHighlight()
{
	var dd = document.getElementById('zoom_ac_dropdown');	
	var items = dd.getElementsByTagName('div');	
	var icount = 0;
	var itotal = items.length;
	if (ZoomAutoComplete_Selected < 0)
		ZoomAutoComplete_Selected = 0;
	else if (ZoomAutoComplete_Selected > itotal)
		ZoomAutoComplete_Selected = ZoomAutoComplete_Selected - itotal;		

	for (i in items)
	{		
		var li = items[i];		
		if (icount == ZoomAutoComplete_Selected)
		{			
			li.className = 'zoom_ac_item_hl';			
		}
		else
			li.className = 'zoom_ac_item';
		icount++;
	}
}

function ZoomAutoComplete_OnLoad(queryID) 
{
	var newDiv = document.createElement('div');
   	newDiv.className = 'zoom_ac_dropdown'; // Don't use setAttribute()
   	newDiv.id = 'zoom_ac_dropdown';   	         
   	   	                   	
	var inputBoxElem = document.getElementById(queryID);
	inputBoxElem.setAttribute("autocomplete", "off");
	if(inputBoxElem.type && inputBoxElem.type.toLowerCase() == "text")
	{
		var left  = ZoomAutoComplete_GetLeft(inputBoxElem);
        var top   = ZoomAutoComplete_GetTop(inputBoxElem) + inputBoxElem.offsetHeight;
        var width = inputBoxElem.offsetWidth;

		inputBoxElem.parentNode.insertBefore(newDiv, inputBoxElem);		

		newDiv.style.left       = left + 'px';
        newDiv.style.top        = top + 'px';
        newDiv.style.width      = width + 'px';                
		newDiv.style.zIndex = '99';
		newDiv.style.visibility = 'hidden';
	}

	inputBoxElem.onkeydown = function ZoomAutoComplete_KeyDown(ev)
	{
		switch (ZoomAutoComplete_GetKeyCode(ev))
		{			
			case ZOOM_AUTOCOMPLETE_TAB:
				ZoomAutoComplete_UseSuggestion();
				return true;
		}
	}
	
	inputBoxElem.onkeyup = function fetchHints(ev) 
	{		
		switch (ZoomAutoComplete_GetKeyCode(ev))
		{			
			case ZOOM_AUTOCOMPLETE_ESC:
				ZoomAutoComplete_Hide();
				return (true);
			case ZOOM_AUTOCOMPLETE_KEYUP:
				if (ZoomAutoComplete_Selected > 0)
					ZoomAutoComplete_Selected--;					
				ZoomAutoComplete_ChangeHighlight();
				return (true);
			case ZOOM_AUTOCOMPLETE_KEYDN:			
				ZoomAutoComplete_Selected++;
				ZoomAutoComplete_ChangeHighlight();
				return (true);		
			default:
				break;			
		}	
				
		if (!ev) 
			ev = window.event;
		
		var input;
		if (ev.srcElement)
			input = ev.srcElement;
		else
			input = ev.target;
												
		if (input.value)
		{
			ZoomAutoComplete_Show();
			ZoomAutoComplete_CallZoom(input.value);				
		}
		else			
			ZoomAutoComplete_Hide();
						
		return (true);
	}			
}



function ZoomAutoComplete_GetXMLHTTP()
{
    var A = null;
    try
    {
    	A = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(E)
    {
	    try
	    {
	    	A = new ActiveXObject("Microsoft.XMLHTTP");
	    }
	    catch(oc)
	    {
	    	A = null;
	    }
    }
    if(!A && typeof XMLHttpRequest != "undefined") 
    {
    	A = new XMLHttpRequest();
    }
    return A;
}

	
function ZoomAutoComplete_CallZoom(Rb)
{	
	//Clear previous search results and hide from the user
	var acElem = document.getElementById('zoom_ac_dropdown');
	acElem.innerHTML = "";
	acElem.style.visibility = 'hidden';

	var openURL = "";
	if (typeof ZoomAutoComplete_URL == "undefined")
		openURL = "search.php?zoom_ac=1";
	else
		openURL = ZoomAutoComplete_URL;
	
	if(ZoomAutoComplete_xmlHttp && ZoomAutoComplete_xmlHttp.readyState!=0)
	{
		ZoomAutoComplete_xmlHttp.abort();
	}
	ZoomAutoComplete_xmlHttp = ZoomAutoComplete_GetXMLHTTP();
	if (ZoomAutoComplete_xmlHttp)
	{
		ZoomAutoComplete_xmlHttp.open("GET", openURL+"&zoom_query="+Rb, true);
		ZoomAutoComplete_xmlHttp.onreadystatechange = function() {
			if (ZoomAutoComplete_xmlHttp.readyState==4 && ZoomAutoComplete_xmlHttp.responseText) 
			{
				if (ZoomAutoComplete_xmlHttp.responseText != 0) 
				{
					var acElem = document.getElementById('zoom_ac_dropdown');
					acElem.innerHTML = ZoomAutoComplete_xmlHttp.responseText;
					if (openURL.indexOf(".aspx") != -1)
						acElem.innerHTML = acElem.innerHTML.replace(new RegExp("<input[^>]*id=\"__VIEWSTATE\"[^>]*>", "gi"), "");
					acElem.style.visibility = '';
				}
		  	}
		};
		ZoomAutoComplete_xmlHttp.send(null);
	}
}