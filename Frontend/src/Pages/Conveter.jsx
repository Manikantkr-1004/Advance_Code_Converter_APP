import React, { useState } from 'react'
import {Box, Button, Flex, Input, Select, useToast} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import MarkdownPreview  from '@uiw/react-markdown-preview';
import axios from "axios"

export function Conveter() {

    const [language,setLanguage] = useState("");
    const [code,setCode] = useState("// Write Your Code here.");
    const [result,setResult] = useState("### Here you will get Result😃😃.");
    const [loading,setLoading] = useState(false)
    const [link,setLink] = useState("")
    const toast = useToast();

    const handleEditorChange = (newValue, event) => {
        setCode(newValue);
    };

    const handleConvert = ()=>{
        if(code==="// Write Your Code here."){
            toast({
                status:"warning",
                title:"Code is Empty, Please write...",
                isClosable:true,
                duration:2000,
                position:"top"
            })
            return;
        }

        if(language===""){
            toast({
                status:"warning",
                title:"You haven't selected any language for Converting",
                isClosable:true,
                duration:2000,
                position:"top"
            })
            return;
        }

        setResult("### Please Wait....");

        axios.post("https://elated-seal-garters.cyclic.app/convert",{code,language})
        .then((res)=>{
            setResult(res.data);
        }).catch((err)=>{
            setResult("### Something went wrong, Please refresh or try again!!")
        })
    }

    const handleDebug = ()=>{
        if(code==='// Write Your Code here.'){
            toast({
                status:"warning",
                title:"Code should not be Empty",
                isClosable:true,
                duration:3000,
                position:"top"
            })
            return;
        }

        setResult("### Please Wait....");

        axios.post("https://elated-seal-garters.cyclic.app/debug",{code})
        .then((res)=>{
            setResult(res.data);
        }).catch((err)=>{
            setResult("### Something went wrong, Please refresh or try again!!")
        })
    }
    
    const handleQualityCheck = ()=>{
        if(code==='// Write Your Code here.'){
            toast({
                status:"warning",
                title:"Code should not be Empty",
                isClosable:true,
                duration:3000,
                position:"top"
            })
            return;
        }

        setResult("### Please Wait....");

        axios.post("https://elated-seal-garters.cyclic.app/quality",{code})
        .then((res)=>{
            setResult(res.data);
        }).catch((err)=>{
            setResult("### Something went wrong, Please refresh or try again!!")
        })
    }
    
    const handleGet = ()=>{
        if(link===""){
            toast({
                status:"warning",
                title:"Please Enter Github File Link",
                isClosable:true,
                duration:2000,
                position:"top"
            })
            return;
        }
        let newLink = link.split("/");
        if((newLink[5]!=="blob" && newLink[6]!=="main") || newLink.length===7){
            toast({
                status:"warning",
                title:"Your Github Link is Invalid, Please Enter correct link...",
                isClosable:true,
                duration:2000,
                position:"top"
            })
            setLink("")
            return;
        }
        setLoading(true)

        axios.post("https://elated-seal-garters.cyclic.app/code",{link})
        .then((res)=>{
            setCode(res.data.content)
            setLoading(false);

        }).catch((err)=>{
            setLoading(false);
            alert("Something is wrong in Your Link, Please re-correct and try again!!")
        })
    }

    return (
        <Box h="100vh" w="100%">
            <Flex w="100%" bg="#e2e2e2" justifyContent="space-evenly" gap="10px" p="0px 5px" alignItems="center" h="15%">
                <Box w="33%" display="flex" justifyContent="center" alignItems="center">
                    <Input value={link} onChange={(e)=> setLink(e.target.value)} border="2px solid black" borderRadius="5px 0px 0px 5px" w="70%" type='text' placeholder="Enter Github File Link" />
                    <Button isDisabled={result==="### Please Wait...." || loading} borderRadius="0px 5px 5px 0px" _hover={{bg:"black"}} onClick={handleGet} _focus={{border:"3px solid #747474"}} variant="unstyled" bg="black" color="white" w="30%">GET CODE</Button>
                </Box>

                <Box w="30%" display="flex" justifyContent="center" alignItems="center">
                    <Select value={language} onChange={(e)=> setLanguage(e.target.value)} w="65%" borderRadius="5px 0px 0px 5px"
                    border="2px solid black" _hover={{border:"2px solid black"}}>
                        <option value="">--Select Language--</option>
                        <option value="JAVA">JAVA</option>
                        <option value="JAVSCRIPT">JAVASCRIPT</option>
                        <option value="C++">C++</option>
                        <option value="C">C</option>
                        <option value="C#">C#</option>
                        <option value="PYTHON">PYTHON</option>
                        <option value="PHP">PHP</option>
                        <option value="RUBY">RUBY</option>
                        <option value="SWIFT">SWIFT</option>
                        <option value="GOLANG">GOLANG</option>
                        <option value="RUST">RUST</option>
                    </Select>
                    <Button isDisabled={result==="### Please Wait...." || loading} borderRadius="0px 5px 5px 0px" _hover={{bg:"black"}} onClick={handleConvert} _focus={{border:"3px solid #747474"}} variant="unstyled" bg="black" color="white" w="35%">CONVERT</Button>
                </Box>

                <Button isDisabled={result==="### Please Wait...." || loading} _hover={{bg:"black"}} onClick={handleDebug} _focus={{border:"3px solid #747474"}} variant="unstyled" bg="black" color="white" w="10%">DEBUG</Button>
                <Button isDisabled={result==="### Please Wait...." || loading} _hover={{bg:"black"}} onClick={handleQualityCheck} _focus={{border:"3px solid #747474"}} variant="unstyled" bg="black" color="white" w="15%">QUALITY CHECK</Button>
            </Flex>

            <Flex w="100%" h="85%" justifyContent="space-between">
                <Box w="50%" h="100%" borderRight="2px solid black">
                    <Editor
                    onChange={handleEditorChange}
                    theme='vs-dark'
                    value={code}
                    options={{
                        inlineSuggest: true,
                        fontSize: "16px",
                        formatOnType: true,
                        autoClosingBrackets: true,
                        minimap: { scale: 10 }
                      }}
                      language='javascript' />
                </Box>
                <Box w="50%" h="100%" p="10px" color="black" overflow="auto"
                fontSize="20px" fontWeight="semibold" borderLeft="2px solid black">
                    <MarkdownPreview border="none" source={result} />
                </Box>
            </Flex>
        </Box>
    )
}
