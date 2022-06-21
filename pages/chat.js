import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import {ButtonSendSticker} from '../src/components/ButtonSendStiker';

const SUPABASE_ANONPUBLIC = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydWdkemV1bnhjeG16cGt2c2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU3NzIwNzUsImV4cCI6MTk3MTM0ODA3NX0.tiTIaQ1VgAFZOc6X9GV-L1AcWuzJfVo-hKoKMy7q7EU'
const SUPABASE_URL = 'https://nrugdzeunxcxmzpkvsgt.supabase.co'

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANONPUBLIC);
function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
      .from('mensagens')
      .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
      })
      .subscribe();
  }

export default function ChatPage() {
    const rotas = useRouter();
    const login = rotas.query.username
    const [mensagem, setMensagem] = React.useState("");
    const[listaMensagem, setListaMensagem] = React.useState([])


    
    React.useEffect(()=>{
        const dados = supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', {ascending:false})
        .then(({data})=>{
            setListaMensagem(data)
        });

        const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
            setListaMensagem((valorAtualDaLista) => {
              return [
                novaMensagem,
                ...valorAtualDaLista,
              ]
            });
          });
      
          return () => {
            subscription.unsubscribe();
          }
    },[]);
   
    

    function handleNovaMensagem (novaMensagem) {
        const mensagem ={
            // id: listaMensagem.length + 1,
            de: login,
            texto: novaMensagem,
        }

        supabaseClient
        .from('mensagens')
        .insert([mensagem])
        .then(({data})=>{})
        
        setMensagem('')
        
    }
    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagem = {listaMensagem}/>
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange = {(event) => {
                                const valor = event.target.value; 
                                setMensagem(valor);
                            }}
                            onKeyPress = {(event) => {
                                if(event.key === 'Enter'){
                                    event.preventDefault("");
                                   handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker 
                            onStickerClick={(sticker) => {
                               handleNovaMensagem(':sticker:'+ sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                overflowX:'hide',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagem.map((mensagem)=>{
                return(
<Text
                key={mensagem.id}
                tag="li"
                styleSheet={{
                    borderRadius: '5px',
                    padding: '6px',
                    marginBottom: '12px',
                    hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }
                }}
            >
                <Box
                    styleSheet={{
                        display:'flex',
                        marginBottom: '8px',
                    }}
                >
                    <Image
                        styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/${mensagem.de}.png`}
                    />
                    <Text tag="strong">
                        {mensagem.de}
                    </Text>
                    <Text
                        styleSheet={{
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                    >
                        {(new Date().toLocaleDateString())}
                    </Text>
                </Box>
                
                {mensagem.texto.startsWith(':sticker:') ? (
                    <Image src={mensagem.texto.replace(':sticker:','') } styleSheet={{
                        maxWidth:'200px'
                    }}/>
                ): (mensagem.texto)}
                
                
            </Text>
                );
            })}
            
        </Box>
    )
}
