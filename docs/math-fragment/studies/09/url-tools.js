export function makeRelative ( 
	// Turns an input URL into a URL relative to another folder or document.
	url,  // the input url, absolute or relative to the current document.
	refUrl,  // the url of the reference folder or document, absolute or relative to the current document.
	stripFilename=true  // set false if the refUrl is a folder, not a document.
	)	{
	if ( typeof url === "string" ) url = new URL( url, document.location );
	if ( typeof refUrl === "string" ) refUrl = new URL( refUrl, document.location );
	if ( url.origin !== refUrl.origin ) return refUrl ;
	const srcFolders = url.pathname.split( "/" ).filter( Boolean );
	const dstFolders = refUrl.pathname.split( "/" ).filter( Boolean );
	const srcFileName = srcFolders.pop( );
	if ( stripFilename ) dstFolders.pop( );
	while ( srcFolders.length && dstFolders.length && srcFolders[ 0 ] === dstFolders[ 0 ] ) {
		srcFolders.shift( );
		dstFolders.shift( );
		}
	srcFolders.push( srcFileName );
	const up = "../".repeat( dstFolders.length );
	const down = srcFolders.join( "/" );
	const path = (( up + down ) || "." ) ;
	return path + url.search + url.hash ;
	}