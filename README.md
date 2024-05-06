# TODO UI

- Form: range selector
- Hover: ? btns

- Profile PAGE

- Modal: EditModal, CreateBumpModal
- Tablet display opt.
- getBumpData(addr)
- AddNewMission
- Order Status?

## Figma

https://www.figma.com/file/uPe3PT6KTe30fwZs9hSDEZ/Pumpers?type=design&node-id=56-94851&mode=design&t=qQSqptk1dlUISnsu-0

256744

## Infos

0- user connects phantom wallet
1- user pastes the token address from pump.fun
2- user selects the number of bots that will trade the token (10 free then more are paid)
3- user adds funds to the bots (example 10 SOL will be distributed equally to all the bots created) 2% fee goes to us
4- USer selects the frequency of buying and selling (30 seconds is in the free tier and other selections are paid)
5- User selects the expiry date of the bots (24 hrs is free tier, other options are paid)
6- user selects the range of size of trades (maybe we keep that one out and we do a fixed range)
8- User can select the paid option of giving the bots names on pump.fun app (you can name the accounts there)
9- user can select the paid option of having the bots reply on the token’s profile on pump.fun
10- user then clicks on Start Bumping and pays all the dues
11- users can Withdraw at anytime. on withdraw all the bots sell the tokens they bought and send back the remaining Solana.
12- user can add more token to bump
13- user can edit the bump settings (cannot downgrade any paid selection only add on unpaid selections)

## Q

1/ SVG hover - Questions - ?
2/ Selectors opt - (botNmbr, frequency, expiry)
3/ Switch - (AssignNames, Reply) - Modal needed?
4/ Price Calc - (ServiceFees)
5/ minFunding?
6/ Order Status?