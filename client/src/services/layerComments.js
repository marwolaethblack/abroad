  const layerComments = (comments) => {
    const sortByParents = (a, b) => {
      if (a.parents.length < b.parents.length) {
        return 1;
      }
      if (a.parents.length > b.parents.length) {
        return -1;
      }
      // a must be equal to b
      return 0;
    };

    const sortByCreatedAt = (a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      // a must be equal to b
      return 0;
    };

    if(comments && comments.length > 0){
        comments.sort(sortByParents);

        comments.slice(0).forEach(comment => {

            //ignore root comment with no parents
            if(comment.parents.length > 1) {
                const parentId = comment.parents[comment.parents.length - 2];

                // Get the parent comment based on the next-to-last
                // comment ID in this comment's parents
                const parentCommentIndex = comments.findIndex(x => (x.id+"") === (parentId+""));

                if(parentCommentIndex > -1) {
                    comments[parentCommentIndex].comments.push(comment);
                    comments.splice(comments.indexOf(comment), 1); 
               }
            }    
        });

        comments.sort(sortByCreatedAt);

        //show the comment selected as an answer first
        const answerCommentIndex = comments.findIndex(x => x.isAnswer);

        if(answerCommentIndex > -1){
            const commentAsAnswer = comments.splice(answerCommentIndex, 1);
            comments = [...commentAsAnswer,...comments]; 
        }
        return comments;
    } else {
      return [];
    }

  }

  export default layerComments;