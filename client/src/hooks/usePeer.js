

import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

const usePeer = () => {
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState('');
    const isPeerSet = useRef(false);

    useEffect(() => {
        if (isPeerSet.current) return;
        isPeerSet.current = true;

        // const myPeer = new Peer();
        const myPeer = new Peer(undefined, {
            host: 'localhost',  
            port: 4100,
            path: '/peerjs/myapp'
        });
      
        setPeer(myPeer);
        myPeer.on('open', (id) => {
            console.log(`Your peer ID is ${id}`);
            setMyId(id);
        });

    }, []);

    return {
        peer,
        myId
    };
};

export default usePeer;




// import { useState, useEffect, useRef } from 'react';

// const usePeer = () => {
//     const [peer, setPeer] = useState(null);
//     const [myId, setMyId] = useState('');
//     const isPeerSet = useRef(false);

//     useEffect(() => {
//         if (isPeerSet.current) return;
//         isPeerSet.current = true;
//         const initPeer = async () => {
//             const { default: Peer } = await import('peerjs');
//             const myPeer = new Peer();
//             setPeer(myPeer);
//             myPeer.on('open', (id) => {
//                 console.log(`Your peer ID is ${id}`);
//                 setMyId(id);
//             });
//         };
//         initPeer();
//     }, []);

//     return {
//         peer,
//         myId
//     };
// };

// export default usePeer;
