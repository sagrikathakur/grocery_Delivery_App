import { ChevronRightIcon, MapPinIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddressCard from '../AddressCard';

const CheckoutAddress = ({ user, address, setAddress, setStep }: any) => {
    return (
        <div className="bg-white rounded-2xl p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-app-green mb-5 flex items-center gap-2">
                <MapPinIcon className="size-5" /> Delivery Address
            </h2>
            {user?.addresses && user.addresses.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-app-green mb-3">Saved Addresses</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {user.addresses.map((addr: any) => (
                            <AddressCard
                                key={addr.id || addr.label}
                                address={addr}
                                variant="checkout"
                                isSelected={address.label === addr.label && address.address === addr.address}
                                onSelect={(selectedAddr) => setAddress({
                                    label: selectedAddr.label,
                                    address: selectedAddr.address,
                                    city: selectedAddr.city,
                                    state: selectedAddr.state,
                                    zip: selectedAddr.zip,
                                    lat: selectedAddr.lat,
                                    lng: selectedAddr.lng,
                                })}
                            />
                        ))}
                    </div>
                </div>
            )}
            <Link to="/addresses" className="mt-6 px-6 py-3 border border-gray-600 text-gray-600 rounded-xl flex-center gap-2">
                Add New Address <PlusIcon className="size-4" />
            </Link>
            <button onClick={() => { setStep("payment"); scrollTo(0, 0) }} disabled={!address.address || !address.city} className="mt-6 px-6 py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-50 flex items-center gap-2">
                Continue to Payment <ChevronRightIcon className="size-4" />
            </button>
        </div>
    )
}

export default CheckoutAddress