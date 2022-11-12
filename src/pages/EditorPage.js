import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';
import axios from 'axios';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [codeconsole,setcodeConsole] = useState(null);
    const [token , setcodeToken] = useState(null);
    const [retoken,setreChecktoken] = useState(false);

    const [currentLang, setCurrentLang] = useState('56')
  
  const changeLang = (newlang) => {
    setCurrentLang(newlang)
  }


    useEffect(() => {
        const init = async () => {

            console.log("Socket start here");
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);


    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }


  /*  if(retoken){
        console.log("Its running untile status update");
        getCode(token);
    }
    */

   const lang_decode =  [
        {
          "id": 45,
          "name": "Assembly (NASM 2.14.02)"
        },
        {
          "id": 46,
          "name": "Bash (5.0.0)"
        },
        {
          "id": 47,
          "name": "Basic (FBC 1.07.1)"
        },
        {
          "id": 75,
          "name": "C (Clang 7.0.1)"
        },
        {
          "id": 76,
          "name": "C++ (Clang 7.0.1)"
        },
        {
          "id": 48,
          "name": "C (GCC 7.4.0)"
        },
        {
          "id": 52,
          "name": "C++ (GCC 7.4.0)"
        },
        {
          "id": 49,
          "name": "C (GCC 8.3.0)"
        },
        {
          "id": 53,
          "name": "C++ (GCC 8.3.0)"
        },
        {
          "id": 50,
          "name": "C (GCC 9.2.0)"
        },
        {
          "id": 54,
          "name": "C++ (GCC 9.2.0)"
        },
        {
          "id": 86,
          "name": "Clojure (1.10.1)"
        },
        {
          "id": 51,
          "name": "C# (Mono 6.6.0.161)"
        },
        {
          "id": 77,
          "name": "COBOL (GnuCOBOL 2.2)"
        },
        {
          "id": 55,
          "name": "Common Lisp (SBCL 2.0.0)"
        },
        {
          "id": 56,
          "name": "D (DMD 2.089.1)"
        },
        {
          "id": 57,
          "name": "Elixir (1.9.4)"
        },
        {
          "id": 58,
          "name": "Erlang (OTP 22.2)"
        },
        {
          "id": 44,
          "name": "Executable"
        },
        {
          "id": 87,
          "name": "F# (.NET Core SDK 3.1.202)"
        },
        {
          "id": 59,
          "name": "Fortran (GFortran 9.2.0)"
        },
        {
          "id": 60,
          "name": "Go (1.13.5)"
        },
        {
          "id": 88,
          "name": "Groovy (3.0.3)"
        },
        {
          "id": 61,
          "name": "Haskell (GHC 8.8.1)"
        },
        {
          "id": 62,
          "name": "Java (OpenJDK 13.0.1)"
        },
        {
          "id": 63,
          "name": "JavaScript (Node.js 12.14.0)"
        },
        {
          "id": 78,
          "name": "Kotlin (1.3.70)"
        },
        {
          "id": 64,
          "name": "Lua (5.3.5)"
        },
        {
          "id": 89,
          "name": "Multi-file program"
        },
        {
          "id": 79,
          "name": "Objective-C (Clang 7.0.1)"
        },
        {
          "id": 65,
          "name": "OCaml (4.09.0)"
        },
        {
          "id": 66,
          "name": "Octave (5.1.0)"
        },
        {
          "id": 67,
          "name": "Pascal (FPC 3.0.4)"
        },
        {
          "id": 85,
          "name": "Perl (5.28.1)"
        },
        {
          "id": 68,
          "name": "PHP (7.4.1)"
        },
        {
          "id": 43,
          "name": "Plain Text"
        },
        {
          "id": 69,
          "name": "Prolog (GNU Prolog 1.4.5)"
        },
        {
          "id": 70,
          "name": "Python (2.7.17)"
        },
        {
          "id": 71,
          "name": "Python (3.8.1)"
        },
        {
          "id": 80,
          "name": "R (4.0.0)"
        },
        {
          "id": 72,
          "name": "Ruby (2.7.0)"
        },
        {
          "id": 73,
          "name": "Rust (1.40.0)"
        },
        {
          "id": 81,
          "name": "Scala (2.13.2)"
        },
        {
          "id": 82,
          "name": "SQL (SQLite 3.27.2)"
        },
        {
          "id": 83,
          "name": "Swift (5.2.3)"
        },
        {
          "id": 74,
          "name": "TypeScript (3.7.4)"
        },
        {
          "id": 84,
          "name": "Visual Basic.Net (vbnc 0.0.0.5943)"
        }
      ]

    async function runCode() {
     console.log(codeRef.current);
  
      try {

        const code_data = {

        "language_id":currentLang,
        "source_code":codeRef.current,
        "stdout":"Hello World"

        };

        const result = await axios.post('https://coderunner3.p.rapidapi.com/submissions/',code_data, {
            headers: {
            'X-RapidAPI-Key': '31eac7b3c3msh2ad01f2a1efd095p126447jsn0ed7e1a2d7e8',
            'X-RapidAPI-Host': 'coderunner3.p.rapidapi.com'
          },
        });

        console.log(result);

        if(result.data.token){
            console.log(result.data.token);
            setcodeToken(result.data.token);
            getCode(result.data.token);

        }

        }
        catch(error) {
            console.log("Error",error);

        }


       
    }


async function getCode(token){

try {
        const get_code_result = await axios.get('https://coderunner3.p.rapidapi.com/submissions/'+token+'?base64_encoded=true', {
            headers: {
            'X-RapidAPI-Key': '31eac7b3c3msh2ad01f2a1efd095p126447jsn0ed7e1a2d7e8',
            'X-RapidAPI-Host': 'coderunner3.p.rapidapi.com'
    },
        });

        console.log(get_code_result.data);

        if(get_code_result.data.compile_output){

            var encodedStringBtoA = atob(get_code_result.data.compile_output);
            setcodeConsole(encodedStringBtoA)
            console.log(encodedStringBtoA);
        }

        if(get_code_result.data.stdout){

            var encodedStringBtoA = atob(get_code_result.data.stdout);
            setcodeConsole(encodedStringBtoA)
            console.log(encodedStringBtoA);
            
        }

        if(get_code_result.data.stderr){

            var encodedStringBtoA = atob(get_code_result.data.stderr);
            setcodeConsole(encodedStringBtoA)
            console.log(encodedStringBtoA);
            
        }


    }
    catch(error){
    console.log(error)
        }
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img
                            className="logoImage"
                            src="/code-sync.png"
                            alt="logo"
                        />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

<form>
        <select className='Select' 
        onChange={(event) => changeLang(event.target.value)}
        >

{lang_decode.map((option) => (

              <option value={option.id}>{option.name}</option>
            ))}

        
        </select>
</form>

                <button className="btn runBtn" onClick={getCode(token)}>
                    Refresh
                </button>

                <button className="btn runBtn" onClick={runCode}>
                    Run Code
                </button>

                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </div>
            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>

            <div className="console">
             <h1>Output</h1>
         
             <p>
            {codeconsole}
             </p>
            </div>
        </div>
    );
};

export default EditorPage;
