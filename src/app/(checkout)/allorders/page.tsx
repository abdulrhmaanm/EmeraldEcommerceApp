import { getUserOrders } from '@/app/apis/ordersApi';
import { IOrderInterface } from '@/app/interfaces/orderInterface';
import Image from 'next/image';
import { Package, CheckCircle, XCircle, Truck, CreditCard, Calendar, MapPin, Phone } from 'lucide-react';


export default async function OrdersPage() {
  const response = await getUserOrders();

  // The Route API returns the orders array directly as response.data
  const orders: IOrderInterface[] = Array.isArray(response?.data)
    ? response.data
    : [];


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">My Orders</h1>
            <p className="text-emerald-100/70">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500">When you place an order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: IOrderInterface) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-900">{order._id}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {order.isPaid ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      <Truck className="w-3.5 h-3.5" />
                      {order.isDelivered ? 'Delivered' : 'In Transit'}
                    </span>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-3 gap-6">
                  {/* Items */}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Items</h3>
                    <div className="space-y-4">
                      {order.cartItems.map((item) => (
                        <div key={item.product._id} className="flex gap-4 items-center">
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                            <Image
                              src={item.product.imageCover}
                              alt={item.product.title}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.product.title}</p>
                            <p className="text-sm text-gray-400">{item.count} × {item.price} EGP</p>
                          </div>
                          <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                            {(item.count * item.price).toFixed(2)} EGP
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Shipping */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Summary</h3>
                      <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span className="capitalize">{order.paymentMethodType}</span>
                        </div>
                        <div className="border-t border-emerald-100 pt-2 flex justify-between font-bold text-gray-900">
                          <span>Total</span>
                          <span className="text-emerald-700">{order.totalOrderPrice} EGP</span>
                        </div>
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Shipping</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span>{order.shippingAddress.details}, {order.shippingAddress.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
