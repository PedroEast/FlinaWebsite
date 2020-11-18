
export class AddTabEvent {
    static dealWith(textInputNode){
        if(!textInputNode)  return;
        textInputNode.addEventListener("keydown", function(e){
        const key: string = e.key;
            if(key === "Tab") {
                let selectedStart = textInputNode.selectionStart;
                let selectedEnd = textInputNode.selectionEnd;
                const value = textInputNode.value;
                if(selectedStart>this.selectionEnd){ const temp = selectedStart; selectedStart = selectedEnd; selectedEnd = temp;}
                // console.log(value.substring(selectedStart, selectedEnd))  

                let beforeSelectTxt  = value.substring(0, selectedStart);
                let afterSelectTxt = value.substring(selectedEnd, value.length-1);
                // console.log(beforeSelectTxt, afterSelectTxt)
                if(beforeSelectTxt[beforeSelectTxt.length-1]!=="\n") selectedStart = beforeSelectTxt.lastIndexOf("\n") + 1;
                if(afterSelectTxt[0]!=="\n") selectedEnd += afterSelectTxt.indexOf("\n");
                // console.log(selectedStart, selectedEnd)
                let selectTxt = value.substring(selectedStart, selectedEnd);
                const lines = selectTxt.split("\n")
                // console.log(lines.join("|"))

                lines.map((line, index) => lines[index] = "\t" + line )
                // console.log(lines.join("|"))
                beforeSelectTxt  = value.substring(0, selectedStart);
                afterSelectTxt = value.substring(selectedEnd, value.length);
                textInputNode.value = beforeSelectTxt + lines.join("\n") + afterSelectTxt;
                
                e.preventDefault();
            }
        })  
    }
}