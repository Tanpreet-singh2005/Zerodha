import React from 'react'
function LeftSection({imageURL, productName, productDescription, tryDemo,learnMore,googlePlay,appStore}) {
  return ( 
    <div className='container'>
      <div className='row'>
        <div className='col-6 p-3'>
          <img src={imageURL} />
        </div>
        <div className='col-6'>
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <a href={tryDemo}style={{textDecoration:"none"}}>Try Demo <i class="fa fa-arrow-right" aria-hidden="true"></i></a>
          &nbsp;&nbsp;
           <a href={learnMore} style={{textDecoration:"none"}}>Learn more <i class="fa fa-arrow-right" aria-hidden="true"></i></a>
           <br></br>
           <br></br>
            <a href={googlePlay} style={{textDecoration:"none"}}><img src='media\images\googlePlayBadge.svg'/></a>
             <a href={appStore}style={{textDecoration:"none"}}><img src='media\images\appstoreBadge.svg'/></a>
        </div>

      </div>

    </div>
   );
}

export default LeftSection;