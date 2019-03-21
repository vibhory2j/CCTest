/**
* B2C Commerce script File
* To define input and output parameters, create entries of the form:
*
* @<paramUsageType> <paramName> : <paramDataType> [<paramComment>]
*
* where
*   <paramUsageType> can be either 'input' or 'output'
*   <paramName> can be any valid parameter name
*   <paramDataType> identifies the type of the parameter
*   <paramComment> is an optional comment
*
* @output Output1 : String the greeting to display
*/
importPackage( dw.system );
importPackage( dw.customer );
function execute( pdict : PipelineDictionary ) : Number
{
    // write pipeline dictionary output parameter
var output1 : String = "Hello B2C Commerce!";  
pdict.Output1 = output1;
    return PIPELET_NEXT;
}