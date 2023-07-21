import { initXMTPClient } from "../libs";

export default function Home({ setXmtp, wallet, signer, xmtp }) {
  const handleXmtp = async () => {
    const xmtp = await initXMTPClient({ signer });
    setXmtp(xmtp);
	localStorage.setItem("xmtp", JSON.stringify(xmtp));
  };

  return (
    <>
      <div>
        <main>
          <div className="flex items-center justify-center h-screen">
            {wallet ? (
              <div>
                <h1>Sign-in with:</h1>
                <ul>
                  {xmtp ? (
                    <li>
                      <p>XMTP connected</p>
                    </li>
                  ) : (
                    <li>
                      <button onClick={() => handleXmtp()}>
                        Connect to XMTP
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div>
                <h1>Connect wallet first</h1>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
