const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");

const connectionProfilePath = "";
const walletPath = "";

module.exports.enrollUser = async (req, res) => {
  try {
    const { enrollmentId, enrollmentSecret } = req?.body;
    if (!enrollmentId || !enrollmentSecret) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }
    // Note: Implement a JWT infrastructure layer

    // Note: Implement a way to check if the user is being registered with Certificate Authority

    // See if the user is already being enrolled
    // Currently this is simply done by checking if the identity exists in the wallet
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet?.get(enrollmentId);
    if (typeof identity !== "undefined") {
      return res.status(409).json({ message: "Identity is already enrolled!" });
    }

    //Make the ca connection
    const ca = new FabricCaServices(
      "url", // Need to be replaced
      { trustedRoots: "cacerts", verify: false }, // Need to be replaced
      "caname" // Need to be replaced
    );

    // Enroll the user
    const enrollment = await ca.enroll({
      enrollmentID: enrollmentId,
      enrollmentSecret: enrollmentSecret,
    });

    // Make the identity
    const X509Identity = {
      credentials: {
        certificate: enrollment?.certificate,
        privateKey: enrollment?.key.toBytes(),
      },
    };

    // insert into wallet
    await wallet?.put(enrollmentId, X509Identity);

    // Note: implement a layer to send the enrollment credentials to the user via any sms, or email service

    return res?.status(200).json({ message: "Enrollment successful!" });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};

module.exports.reenrollUser = async (req, res) => {
  try {
    // Note: Implement a JWT infrastructure layer

    // Note: Implement a way to check if the user is being registered with Certificate Authority

    // See if the user is already being enrolled
    // Currently this is simply done by checking if the identity exists in the wallet
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet?.get(enrollmentId);
    if (typeof identity !== "undefined") {
      return res.status(409).json({ message: "Identity is already enrolled!" });
    }
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
