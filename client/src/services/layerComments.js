  const layerComments = (comments) => {
    const sort = function (a, b) {
      if (a.parents.length < b.parents.length) {
        return 1;
      }
      if (a.parents.length > b.parents.length) {
        return -1;
      }
      // a must be equal to b
      return 0;
    };

    comments.sort(sort);

    comments.slice(0).forEach(comment => {

        //ignore root comment with no parents
        if(comment.parents.length > 1) {
            const parentId = comment.parents[comment.parents.length - 2];

            // Get the parent comment based on the next-to-last
            // comment ID in this comment's parents
            const parentCommentIndex = comments.findIndex(x => (x._id+"") === (parentId+""));

            if(parentCommentIndex > -1) {
                comments[parentCommentIndex].comments.push(comment);
                comments.splice(comments.indexOf(comment), 1); 
           }
        }    
    });
    return comments;
  }

  export default layerComments;